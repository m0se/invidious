-- Table: public.tags

-- DROP TABLE public.tags;

CREATE TABLE public.channel_tags
(
  email text NOT NULL,
  ucid text NOT NULL,
  tags text[],
  CONSTRAINT tags_id_key UNIQUE (email,ucid)
);

GRANT ALL ON TABLE public.channel_tags TO kemal;

-- Index: public.tags_id_idx

-- DROP INDEX public.tags_id_idx;

CREATE INDEX channel_tags_id_idx
  ON public.channel_tags
  USING btree
  (email COLLATE pg_catalog."default", ucid COLLATE pg_catalog."default");
