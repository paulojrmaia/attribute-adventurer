CREATE OR REPLACE FUNCTION public.block_removed_character_class()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.class = 'rogue'::public.character_class THEN
    RAISE EXCEPTION 'A classe Ladino (rogue) foi removida do jogo';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER block_removed_character_class_trigger
BEFORE INSERT OR UPDATE ON public.characters
FOR EACH ROW EXECUTE FUNCTION public.block_removed_character_class();

COMMENT ON TYPE public.character_class IS 'DEPRECATED value: rogue — classe removida do jogo; mantida apenas para preservar registros antigos.';