DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.characters
    WHERE class = 'rogue'::public.character_class
  ) THEN
    RAISE EXCEPTION 'Existem personagens Ladino legados; a migração foi interrompida sem alterar ou apagar dados';
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS block_removed_character_class_trigger ON public.characters;
DROP FUNCTION IF EXISTS public.block_removed_character_class();

ALTER TYPE public.character_class RENAME TO character_class_legacy;
CREATE TYPE public.character_class AS ENUM ('warrior', 'mage', 'archer');

ALTER TABLE public.characters
  ADD COLUMN playable_class public.character_class;

UPDATE public.characters
SET playable_class = class::text::public.character_class
WHERE playable_class IS NULL;

ALTER TABLE public.characters
  ALTER COLUMN playable_class SET NOT NULL;

COMMENT ON COLUMN public.characters.class IS 'DEPRECATED: compatibility mirror for legacy clients; use playable_class for the current three-class game.';

CREATE OR REPLACE FUNCTION public.block_removed_character_class()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.class = 'rogue'::public.character_class_legacy THEN
    RAISE EXCEPTION 'A classe Ladino (rogue) foi removida do jogo';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER block_removed_character_class_trigger
BEFORE INSERT OR UPDATE ON public.characters
FOR EACH ROW EXECUTE FUNCTION public.block_removed_character_class();