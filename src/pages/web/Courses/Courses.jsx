import { useState, useEffect } from "react";
import { getCoursesRequest, COURSE_IMAGE_BASE_URL } from "../../../Services/CoursesService";
import "./Courses.scss";

const ITEMS_PER_PAGE = 6;

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // true = solo cursos activos, ocultamos los inactivos al público
        const data = await getCoursesRequest(currentPage, ITEMS_PER_PAGE, true);
        setCourses(data.docs || data.courses || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="tc-courses-page">
      <div className="tc-courses-page__header">
        <span className="tc-courses-page__eyebrow">// cursos</span>
        <h1>Nuestros cursos</h1>
        <p>
          Aprende con proyectos reales, a tu ritmo, con contenido que se
          mantiene al día con la industria.
        </p>
      </div>

      <div className="tc-courses-page__inner">
        {loading && <p className="tc-courses-page__state">Cargando cursos...</p>}

        {!loading && error && (
          <p className="tc-courses-page__state tc-courses-page__state--error">
            {error}
          </p>
        )}

        {!loading && !error && courses.length === 0 && (
          <p className="tc-courses-page__state">
            Todavía no hay cursos publicados. Vuelve pronto.
          </p>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="tc-courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="tc-course-item">
                <div className="tc-course-item__image">
                  {course.miniature && !brokenImages[course._id] ? (
                    <img
                      src={`${COURSE_IMAGE_BASE_URL}/${course.miniature}`}
                      alt={course.title}
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [course._id]: true }))
                      }
                    />
                  ) : (
                    <div className="tc-course-item__placeholder">🎓</div>
                  )}
                  {course.score !== undefined && course.score !== null && (
                    <span className="tc-course-item__score">
                      ⭐ {course.score}
                    </span>
                  )}
                </div>

                <div className="tc-course-item__body">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="tc-course-item__footer">
                    <span className="tc-course-item__price">
                      S/ {course.price}
                    </span>
                    {course.url ? (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="tc-course-item__cta"
                      >
                        Ver curso →
                      </a>
                    ) : (
                      <span className="tc-course-item__cta tc-course-item__cta--disabled">
                        Próximamente
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="tc-courses-pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>

            <div className="tc-courses-pagination__pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={page === currentPage ? "active" : ""}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
