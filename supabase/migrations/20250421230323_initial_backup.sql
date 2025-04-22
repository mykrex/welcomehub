

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."administrador_usuario" (
    "id_administrador" "uuid" NOT NULL
);


ALTER TABLE "public"."administrador_usuario" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asistente" (
    "id_asistente" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" character varying NOT NULL,
    "modelo_ai" "text" NOT NULL
);


ALTER TABLE "public"."asistente" OWNER TO "postgres";


COMMENT ON TABLE "public"."asistente" IS 'Table for the registers for every user';



CREATE TABLE IF NOT EXISTS "public"."autentitcacion" (
    "id_sesion" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "is_usuario" "uuid" NOT NULL,
    "token" "text" NOT NULL,
    "expiracion" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."autentitcacion" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."curso" (
    "id_curso" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" character varying NOT NULL,
    "descripcion" "text" NOT NULL,
    "duracion" integer NOT NULL
);


ALTER TABLE "public"."curso" OWNER TO "postgres";


COMMENT ON TABLE "public"."curso" IS 'Table for information about user courses';



CREATE TABLE IF NOT EXISTS "public"."curso_usuario" (
    "id_usuario" "uuid" NOT NULL,
    "id_curso" "uuid" NOT NULL,
    "estado" character varying NOT NULL,
    "fecha_inicio" "date" NOT NULL,
    "fecha_fin" "date" NOT NULL
);


ALTER TABLE "public"."curso_usuario" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dashboard" (
    "id_dashboard" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "lista_cursos" "json" NOT NULL,
    "progreso_total" real NOT NULL,
    "notificaciones" "json",
    "id_asistente" "uuid"
);


ALTER TABLE "public"."dashboard" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipo_trabajo" (
    "id_equipo" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" character varying NOT NULL,
    "id_administrador" "uuid" NOT NULL
);


ALTER TABLE "public"."equipo_trabajo" OWNER TO "postgres";


COMMENT ON TABLE "public"."equipo_trabajo" IS 'Tabla para los equipos de trabajos existentes';



CREATE TABLE IF NOT EXISTS "public"."mensajes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "input_usuario" "text" NOT NULL,
    "output_bot" "text" NOT NULL,
    "timestamp" timestamp without time zone DEFAULT "now"(),
    "id_usuario" "uuid" NOT NULL
);


ALTER TABLE "public"."mensajes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notificacion" (
    "id_notificacion" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "mensaje" "text" NOT NULL,
    "tipo" character varying NOT NULL,
    "id_curso" "uuid"
);


ALTER TABLE "public"."notificacion" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notificación_usuario" (
    "id_notificacion" "uuid" NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "fecha" "date",
    "leido" boolean
);


ALTER TABLE "public"."notificación_usuario" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."progreso" (
    "id_progreso" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "id_curso" "uuid" NOT NULL,
    "progreso" real,
    "ultima_actualizacion" timestamp without time zone
);


ALTER TABLE "public"."progreso" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."registro_tiempo" (
    "id_registro" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "hora_entrada" timestamp without time zone NOT NULL,
    "hora_salida" timestamp without time zone NOT NULL,
    "horas_trabajadas" real NOT NULL,
    "productividad" character varying NOT NULL
);


ALTER TABLE "public"."registro_tiempo" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usuario" (
    "id_usuario" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombres" character varying NOT NULL,
    "email" character varying NOT NULL,
    "contrasena" character varying,
    "rol" character varying NOT NULL,
    "estado_onboarding" character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "apellidos" character varying NOT NULL,
    "telefono" bigint NOT NULL,
    "puesto" character varying NOT NULL,
    "en_neoris_desde" "date" NOT NULL,
    "fecha_nacimiento" "date" NOT NULL,
    "id_equipo" "uuid" NOT NULL,
    "estado" boolean DEFAULT false NOT NULL,
    CONSTRAINT "usuario_apellidos_check" CHECK (("length"(("apellidos")::"text") <= 60)),
    CONSTRAINT "usuario_contrasena_check" CHECK (("length"(("contrasena")::"text") <= 100)),
    CONSTRAINT "usuario_email_check" CHECK (("length"(("email")::"text") <= 100)),
    CONSTRAINT "usuario_estado_onboarding_check" CHECK (("length"(("estado_onboarding")::"text") <= 50)),
    CONSTRAINT "usuario_nombres_check" CHECK (("length"(("nombres")::"text") <= 80)),
    CONSTRAINT "usuario_rol_check" CHECK (("length"(("rol")::"text") <= 50))
);


ALTER TABLE "public"."usuario" OWNER TO "postgres";


COMMENT ON TABLE "public"."usuario" IS 'A table to store the company users';



ALTER TABLE ONLY "public"."notificacion"
    ADD CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id_notificacion");



ALTER TABLE ONLY "public"."administrador_usuario"
    ADD CONSTRAINT "administrador_usuario_pkey" PRIMARY KEY ("id_administrador");



ALTER TABLE ONLY "public"."asistente"
    ADD CONSTRAINT "asistente_pkey" PRIMARY KEY ("id_asistente");



ALTER TABLE ONLY "public"."autentitcacion"
    ADD CONSTRAINT "autentitcacion_pkey" PRIMARY KEY ("id_sesion");



ALTER TABLE ONLY "public"."curso"
    ADD CONSTRAINT "curso_pkey" PRIMARY KEY ("id_curso");



ALTER TABLE ONLY "public"."curso_usuario"
    ADD CONSTRAINT "curso_usuario_pkey" PRIMARY KEY ("id_usuario", "id_curso");



ALTER TABLE ONLY "public"."dashboard"
    ADD CONSTRAINT "dashboard_pkey" PRIMARY KEY ("id_dashboard");



ALTER TABLE ONLY "public"."equipo_trabajo"
    ADD CONSTRAINT "equipo_trabajo_pkey" PRIMARY KEY ("id_equipo");



ALTER TABLE ONLY "public"."mensajes"
    ADD CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notificación_usuario"
    ADD CONSTRAINT "notificación_usuario_pkey" PRIMARY KEY ("id_notificacion", "id_usuario");



ALTER TABLE ONLY "public"."progreso"
    ADD CONSTRAINT "progreso_pkey" PRIMARY KEY ("id_progreso");



ALTER TABLE ONLY "public"."registro_tiempo"
    ADD CONSTRAINT "registro_tiempo_pkey" PRIMARY KEY ("id_registro");



ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario");



ALTER TABLE ONLY "public"."administrador_usuario"
    ADD CONSTRAINT "administrador_usuario_id_administrador_fkey" FOREIGN KEY ("id_administrador") REFERENCES "public"."usuario"("id_usuario");



ALTER TABLE ONLY "public"."autentitcacion"
    ADD CONSTRAINT "autentitcacion_is_usuario_fkey" FOREIGN KEY ("is_usuario") REFERENCES "public"."usuario"("id_usuario");



ALTER TABLE ONLY "public"."curso_usuario"
    ADD CONSTRAINT "curso_usuario_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "public"."curso"("id_curso");



ALTER TABLE ONLY "public"."curso_usuario"
    ADD CONSTRAINT "curso_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario");



ALTER TABLE ONLY "public"."dashboard"
    ADD CONSTRAINT "dashboard_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario");



ALTER TABLE ONLY "public"."equipo_trabajo"
    ADD CONSTRAINT "equipo_trabajo_id_administrador_fkey" FOREIGN KEY ("id_administrador") REFERENCES "public"."administrador_usuario"("id_administrador");



ALTER TABLE ONLY "public"."mensajes"
    ADD CONSTRAINT "mensajes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notificacion"
    ADD CONSTRAINT "notificacion_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "public"."curso"("id_curso");



ALTER TABLE ONLY "public"."notificación_usuario"
    ADD CONSTRAINT "notificación_usuario_id_notificacion_fkey" FOREIGN KEY ("id_notificacion") REFERENCES "public"."notificacion"("id_notificacion");



ALTER TABLE ONLY "public"."notificación_usuario"
    ADD CONSTRAINT "notificación_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario");



ALTER TABLE ONLY "public"."progreso"
    ADD CONSTRAINT "progreso_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "public"."curso"("id_curso");



ALTER TABLE ONLY "public"."progreso"
    ADD CONSTRAINT "progreso_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario");



ALTER TABLE ONLY "public"."registro_tiempo"
    ADD CONSTRAINT "registro_tiempo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario");



ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "public"."equipo_trabajo"("id_equipo");



CREATE POLICY "Allow insert if user is linked" ON "public"."mensajes" FOR INSERT WITH CHECK (("id_usuario" IS NOT NULL));



CREATE POLICY "Permitir actualización de contraseña" ON "public"."usuario" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Permitir lectura si email coincide" ON "public"."usuario" FOR SELECT USING (true);



ALTER TABLE "public"."administrador_usuario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."asistente" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."autentitcacion" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."curso" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."curso_usuario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."dashboard" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipo_trabajo" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mensajes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notificacion" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notificación_usuario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progreso" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."registro_tiempo" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."usuario" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."usuario";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."administrador_usuario" TO "anon";
GRANT ALL ON TABLE "public"."administrador_usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."administrador_usuario" TO "service_role";



GRANT ALL ON TABLE "public"."asistente" TO "anon";
GRANT ALL ON TABLE "public"."asistente" TO "authenticated";
GRANT ALL ON TABLE "public"."asistente" TO "service_role";



GRANT ALL ON TABLE "public"."autentitcacion" TO "anon";
GRANT ALL ON TABLE "public"."autentitcacion" TO "authenticated";
GRANT ALL ON TABLE "public"."autentitcacion" TO "service_role";



GRANT ALL ON TABLE "public"."curso" TO "anon";
GRANT ALL ON TABLE "public"."curso" TO "authenticated";
GRANT ALL ON TABLE "public"."curso" TO "service_role";



GRANT ALL ON TABLE "public"."curso_usuario" TO "anon";
GRANT ALL ON TABLE "public"."curso_usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."curso_usuario" TO "service_role";



GRANT ALL ON TABLE "public"."dashboard" TO "anon";
GRANT ALL ON TABLE "public"."dashboard" TO "authenticated";
GRANT ALL ON TABLE "public"."dashboard" TO "service_role";



GRANT ALL ON TABLE "public"."equipo_trabajo" TO "anon";
GRANT ALL ON TABLE "public"."equipo_trabajo" TO "authenticated";
GRANT ALL ON TABLE "public"."equipo_trabajo" TO "service_role";



GRANT ALL ON TABLE "public"."mensajes" TO "anon";
GRANT ALL ON TABLE "public"."mensajes" TO "authenticated";
GRANT ALL ON TABLE "public"."mensajes" TO "service_role";



GRANT ALL ON TABLE "public"."notificacion" TO "anon";
GRANT ALL ON TABLE "public"."notificacion" TO "authenticated";
GRANT ALL ON TABLE "public"."notificacion" TO "service_role";



GRANT ALL ON TABLE "public"."notificación_usuario" TO "anon";
GRANT ALL ON TABLE "public"."notificación_usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."notificación_usuario" TO "service_role";



GRANT ALL ON TABLE "public"."progreso" TO "anon";
GRANT ALL ON TABLE "public"."progreso" TO "authenticated";
GRANT ALL ON TABLE "public"."progreso" TO "service_role";



GRANT ALL ON TABLE "public"."registro_tiempo" TO "anon";
GRANT ALL ON TABLE "public"."registro_tiempo" TO "authenticated";
GRANT ALL ON TABLE "public"."registro_tiempo" TO "service_role";



GRANT ALL ON TABLE "public"."usuario" TO "anon";
GRANT ALL ON TABLE "public"."usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."usuario" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
