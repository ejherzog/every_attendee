--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Postgres.app)
-- Dumped by pg_dump version 17.2 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_users; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.app_users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    person_id integer
);


ALTER TABLE public.app_users OWNER TO evajherzog;

--
-- Name: app_users_events; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.app_users_events (
    id integer NOT NULL,
    app_user_id integer NOT NULL,
    event_id character(6)
);


ALTER TABLE public.app_users_events OWNER TO evajherzog;

--
-- Name: app_users_events_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

ALTER TABLE public.app_users_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.app_users_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: app_users_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

CREATE SEQUENCE public.app_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.app_users_id_seq OWNER TO evajherzog;

--
-- Name: app_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: evajherzog
--

ALTER SEQUENCE public.app_users_id_seq OWNED BY public.app_users.id;


--
-- Name: diets; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.diets (
    id integer NOT NULL,
    type character varying(30),
    details character varying(100),
    custom boolean
);


ALTER TABLE public.diets OWNER TO evajherzog;

--
-- Name: diets_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

ALTER TABLE public.diets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.diets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.events (
    id character(6) NOT NULL,
    title character varying(200) NOT NULL,
    location text,
    address text,
    description text,
    image_url text,
    start_time character varying(30),
    end_time character varying(30)
);


ALTER TABLE public.events OWNER TO evajherzog;

--
-- Name: guests; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.guests (
    id integer NOT NULL,
    response_id character(4) NOT NULL,
    guest_id integer NOT NULL,
    attending character varying(20) NOT NULL,
    CONSTRAINT guests_attending_check CHECK (((attending)::text = ANY ((ARRAY['Yes'::character varying, 'No'::character varying, 'Maybe'::character varying])::text[])))
);


ALTER TABLE public.guests OWNER TO evajherzog;

--
-- Name: guests_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

ALTER TABLE public.guests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.guests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hosts; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.hosts (
    id integer NOT NULL,
    event_id character(6),
    host_id integer
);


ALTER TABLE public.hosts OWNER TO evajherzog;

--
-- Name: hosts_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

ALTER TABLE public.hosts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hosts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: people; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.people (
    id integer NOT NULL,
    short_name character varying(50) NOT NULL,
    full_name character varying(200),
    email character varying(400),
    phone character varying(20)
);


ALTER TABLE public.people OWNER TO evajherzog;

--
-- Name: people_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

ALTER TABLE public.people ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.people_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: person_diets; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.person_diets (
    id integer NOT NULL,
    person_id integer,
    diet_id integer
);


ALTER TABLE public.person_diets OWNER TO evajherzog;

--
-- Name: person_diets_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

ALTER TABLE public.person_diets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.person_diets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: person_pronouns; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.person_pronouns (
    id integer NOT NULL,
    person_id integer,
    pronoun_id integer
);


ALTER TABLE public.person_pronouns OWNER TO evajherzog;

--
-- Name: person_pronouns_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

ALTER TABLE public.person_pronouns ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.person_pronouns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pronouns; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.pronouns (
    id integer NOT NULL,
    subject character varying(20),
    object character varying(20),
    possessive character varying(20),
    determiner character varying(20),
    reflexive character varying(20),
    nickname character varying(100) NOT NULL,
    custom boolean
);


ALTER TABLE public.pronouns OWNER TO evajherzog;

--
-- Name: pronouns_id_seq; Type: SEQUENCE; Schema: public; Owner: evajherzog
--

ALTER TABLE public.pronouns ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pronouns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: responses; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.responses (
    id character(4) NOT NULL,
    respondent_id integer,
    guest_id integer,
    event_id character(6),
    attending character varying(20),
    comments text
);


ALTER TABLE public.responses OWNER TO evajherzog;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: evajherzog
--

CREATE TABLE public.user_sessions (
    id text NOT NULL,
    user_id integer NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO evajherzog;

--
-- Name: app_users id; Type: DEFAULT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.app_users ALTER COLUMN id SET DEFAULT nextval('public.app_users_id_seq'::regclass);


--
-- Name: app_users app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.app_users
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- Name: app_users app_user_username_key; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.app_users
    ADD CONSTRAINT app_user_username_key UNIQUE (username);


--
-- Name: app_users_events app_users_events_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.app_users_events
    ADD CONSTRAINT app_users_events_pkey PRIMARY KEY (id);


--
-- Name: diets diets_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.diets
    ADD CONSTRAINT diets_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: guests guests_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_pkey PRIMARY KEY (id);


--
-- Name: hosts hosts_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.hosts
    ADD CONSTRAINT hosts_pkey PRIMARY KEY (id);


--
-- Name: people people_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);


--
-- Name: person_diets person_diets_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.person_diets
    ADD CONSTRAINT person_diets_pkey PRIMARY KEY (id);


--
-- Name: person_pronouns person_pronouns_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.person_pronouns
    ADD CONSTRAINT person_pronouns_pkey PRIMARY KEY (id);


--
-- Name: pronouns pronouns_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.pronouns
    ADD CONSTRAINT pronouns_pkey PRIMARY KEY (id);


--
-- Name: responses rsvps_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT rsvps_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_session_pkey; Type: CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_session_pkey PRIMARY KEY (id);


--
-- Name: app_users_events app_users_events_app_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.app_users_events
    ADD CONSTRAINT app_users_events_app_user_id_fkey FOREIGN KEY (app_user_id) REFERENCES public.app_users(id);


--
-- Name: app_users_events app_users_events_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.app_users_events
    ADD CONSTRAINT app_users_events_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: app_users app_users_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.app_users
    ADD CONSTRAINT app_users_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id);


--
-- Name: guests guests_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.people(id);


--
-- Name: guests guests_response_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_response_id_fkey FOREIGN KEY (response_id) REFERENCES public.responses(id);


--
-- Name: hosts hosts_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.hosts
    ADD CONSTRAINT hosts_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: hosts hosts_host_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.hosts
    ADD CONSTRAINT hosts_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.people(id);


--
-- Name: person_diets person_diets_diet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.person_diets
    ADD CONSTRAINT person_diets_diet_id_fkey FOREIGN KEY (diet_id) REFERENCES public.diets(id);


--
-- Name: person_diets person_diets_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.person_diets
    ADD CONSTRAINT person_diets_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id);


--
-- Name: person_pronouns person_pronouns_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.person_pronouns
    ADD CONSTRAINT person_pronouns_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id);


--
-- Name: person_pronouns person_pronouns_pronoun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.person_pronouns
    ADD CONSTRAINT person_pronouns_pronoun_id_fkey FOREIGN KEY (pronoun_id) REFERENCES public.pronouns(id);


--
-- Name: responses rsvps_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: responses rsvps_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT rsvps_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.people(id);


--
-- Name: responses rsvps_respondent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT rsvps_respondent_id_fkey FOREIGN KEY (respondent_id) REFERENCES public.people(id);


--
-- Name: user_sessions user_session_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: evajherzog
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_users(id);


--
-- Name: TABLE app_users; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.app_users TO local_db;


--
-- Name: TABLE app_users_events; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.app_users_events TO local_db;


--
-- Name: TABLE diets; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.diets TO local_db;


--
-- Name: TABLE events; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.events TO local_db;


--
-- Name: TABLE guests; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.guests TO local_db;


--
-- Name: TABLE hosts; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.hosts TO local_db;


--
-- Name: TABLE people; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.people TO local_db;


--
-- Name: TABLE person_diets; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.person_diets TO local_db;


--
-- Name: TABLE person_pronouns; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.person_pronouns TO local_db;


--
-- Name: TABLE pronouns; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.pronouns TO local_db;


--
-- Name: TABLE responses; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.responses TO local_db;


--
-- Name: TABLE user_sessions; Type: ACL; Schema: public; Owner: evajherzog
--

GRANT ALL ON TABLE public.user_sessions TO local_db;


--
-- PostgreSQL database dump complete
--

