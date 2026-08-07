import { useState, useEffect } from "react";
import {
  getCoursesRequest,
  toggleCourseStatusRequest,
  deleteCourseRequest,
} from "../../../Services/CoursesService";
import { CourseFormModal } from "./CourseFormModal";
import { usePermissions } from "../../../Hooks/usePermissions";
import "./Courses.scss";

const ITEMS_PER_PAGE = 6;

export function Courses() {
  const { hasRole } = usePermissions();
  const [courses, setCourses] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all"); // all | active | inactive
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const activeFilterValue = filter === "active" ? true : filter === "inactive" ? false : undefined;

  const loadCourses = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCoursesRequest(page, ITEMS_PER_PAGE, activeFilterValue);
      setCourses(data.docs || []);
      setTotalPages(data.totalPages || 1);
      setTotalDocs(data.totalDocs || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCourses(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filter]);

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleToggleStatus = async (course) => {
    try {
      await toggleCourseStatusRequest(course._id, !course.active);
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, active: !c.active } : c))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourseRequest(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaved = () => {
    setModalOpen(false);
    loadCourses(currentPage);
  };

  return (
    <div className="courses-page">
      <div className="courses-page__toolbar">
        <div className="courses-page__filters">
          <button className={filter === "all" ? "active" : ""} onClick={() => changeFilter("all")}>
            Todos
          </button>
          <button
            className={filter === "active" ? "active" : ""}
            onClick={() => changeFilter("active")}
          >
            Activos
          </button>
          <button
            className={filter === "inactive" ? "active" : ""}
            onClick={() => changeFilter("inactive")}
          >
            Inactivos
          </button>
        </div>

        <div className="courses-page__actions">
          <div className="courses-page__search-wrapper">
            <svg
              className="courses-page__search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre de curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="courses-page__search"
            />
          </div>
          {hasRole("editor") && (
            <button className="courses-page__new-btn" onClick={openCreateModal}>
              + Nuevo curso
            </button>
          )}
        </div>
      </div>

      {loading && <p className="courses-page__state">Cargando cursos...</p>}
      {error && <p className="courses-page__state courses-page__state--error">{error}</p>}
      {!loading && !error && filteredCourses.length === 0 && (
        <p className="courses-page__state">No se encontraron cursos.</p>
      )}

      {!loading && !error && (
        <p className="courses-page__total">
          {totalDocs} curso{totalDocs !== 1 ? "s" : ""} en total
        </p>
      )}

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course._id} className="course-card">
            <div className="course-card__image">
              {course.miniature ? (
                <img
                  src={course.miniature}
                  alt={course.title}
                />
              ) : (
                <div className="course-card__image-placeholder">🎓</div>
              )}
              <span
                className={`course-card__status ${
                  course.active
                    ? "course-card__status--active"
                    : "course-card__status--inactive"
                }`}
              >
                {course.active ? "Activo" : "Inactivo"}
              </span>
              {course.score !== undefined && course.score !== null && (
                <span className="course-card__score">⭐ {course.score}</span>
              )}
            </div>

            <div className="course-card__body">
              <h3 className="course-card__title">{course.title}</h3>
              <p className="course-card__description">{course.description}</p>

              <div className="course-card__meta">
                <span className="price">S/ {course.price}</span>
                {course.url && (
                  <a href={course.url} target="_blank" rel="noreferrer" className="course-card__link">
                    Ver enlace ↗
                  </a>
                )}
              </div>

              {hasRole("editor") && (
                <div className="course-card__actions">
                  <button onClick={() => openEditModal(course)} title="Editar">
                    ✏️
                  </button>
                  <button onClick={() => handleToggleStatus(course)} title="Activar/Desactivar">
                    {course.active ? "🔒" : "🔓"}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(course._id)}
                    title="Eliminar"
                    className="danger"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="courses-pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="courses-pagination__nav"
          >
            ← Anterior
          </button>

          <div className="courses-pagination__pages">
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
            className="courses-pagination__nav"
          >
            Siguiente →
          </button>
        </div>
      )}

      {modalOpen && (
        <CourseFormModal
          course={editingCourse}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {confirmDeleteId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>¿Eliminar este curso? Esta acción no se puede deshacer.</p>
            <div className="confirm-box__actions">
              <button onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
              <button className="danger" onClick={() => handleDelete(confirmDeleteId)}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}