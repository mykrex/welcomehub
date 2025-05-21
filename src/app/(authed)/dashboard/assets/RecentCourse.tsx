import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import "./recentCourse.css";

export default function RecentCourse() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>

      <div className="recent-course-container">
        <div className="recent-course-header">
          <div className="recent-course-header-content">
            <div className="rc-card-title">Retomar mi curso más reciente:</div>
            <div className="rc-course-title">Atención al Cliente y Ventas</div>
            <div className="rc-description">
              Este curso proporciona las habilidades esenciales para interactuar
              de manera efectiva con los clientes, brindando un servicio de
              calidad y potenciando las ventas.
            </div>
            <Link
              href="/cursos/verCurso/8"
              className="recent-course-button modern-arrow-button"
            >
              Ir a Curso
            </Link>
          </div>
        </div>

        <div className="recent-course-side">
          <div className="recent-course-image-wrapper shine">
            <Image
              src="/imagen8.jpg"
              alt="Imagen del curso"
              fill
              className="recent-course-image"
            />
          </div>
        </div>
      </div>
    </>
  );
}
