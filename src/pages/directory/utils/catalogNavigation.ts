import type {
  Catalog,
  CatalogCourse,
  CatalogItem,
  CatalogNoteFolder,
  CatalogProgram,
} from "../types/catalog";

type DirectorySection = "programs" | "courses" | "notes";

export type DirectoryLevel = "programs" | "courses" | "notes" | "items";

type DirectoryEntryType = "folder" | CatalogItem["type"];

interface DirectoryEntry {
  id: string;
  name: string;
  type: DirectoryEntryType;
  href?: string;
  meta?: string;
}

interface Breadcrumb {
  label: string;
  href: string;
}

interface DirectoryContext {
  title: string;
  level: DirectoryLevel;
  entries: DirectoryEntry[];
  breadcrumbs: Breadcrumb[];
  errorMessage?: string;
}

const sectionConfig: Record<DirectorySection, { label: string; root: string }> =
  {
    programs: { label: "Programs", root: "/directory" },
    courses: { label: "Courses", root: "/directory" },
    notes: { label: "Notes", root: "/directory" },
  };

const isSection = (value: string | undefined): value is DirectorySection =>
  value === "programs" || value === "courses" || value === "notes";

const parseSection = (
  segments: string[],
): { section: DirectorySection; offset: number } => {
  const [first] = segments;

  if (isSection(first)) {
    return { section: first, offset: 1 };
  }

  return { section: "programs", offset: 0 };
};

const buildSectionHref = (
  section: DirectorySection,
  segments: string[],
): string => {
  const root = sectionConfig[section].root;

  if (segments.length === 0) {
    return root;
  }

  return `${root}/${segments.join("/")}`;
};

const buildBreadcrumbs = (
  section: DirectorySection,
  program?: CatalogProgram,
  course?: CatalogCourse,
  note?: CatalogNoteFolder,
): Breadcrumb[] => [
  { label: sectionConfig[section].label, href: buildSectionHref(section, []) },
  ...(program
    ? [{ label: program.name, href: buildSectionHref(section, [program.id]) }]
    : []),
  ...(program && course
    ? [
        {
          label: course.name,
          href: buildSectionHref(section, [program.id, course.id]),
        },
      ]
    : []),
  ...(program && course && note
    ? [
        {
          label: note.name,
          href: buildSectionHref(section, [program.id, course.id, note.id]),
        },
      ]
    : []),
];

const buildProgramEntries = (catalog: Catalog): DirectoryEntry[] =>
  catalog.map((program) => ({
    id: program.id,
    name: program.name,
    type: program.type,
    href: buildSectionHref("programs", [program.id]),
    meta: `${program.courses.length} courses`,
  }));

const buildCourseEntry = (
  section: DirectorySection,
  program: CatalogProgram,
  course: CatalogCourse,
  meta: string,
): DirectoryEntry => ({
  id: `${program.id}/${course.id}`,
  name: course.name,
  type: course.type,
  href: buildSectionHref(section, [program.id, course.id]),
  meta,
});

const buildNoteEntry = (
  section: DirectorySection,
  program: CatalogProgram,
  course: CatalogCourse,
  note: CatalogNoteFolder,
  meta: string,
): DirectoryEntry => ({
  id: `${program.id}/${course.id}/${note.id}`,
  name: note.name,
  type: note.type,
  href: buildSectionHref(section, [program.id, course.id, note.id]),
  meta,
});

const buildCourseEntriesForProgram = (
  section: DirectorySection,
  program: CatalogProgram,
): DirectoryEntry[] =>
  program.courses.map((course) =>
    buildCourseEntry(
      section,
      program,
      course,
      `${course.notes.length} note sets`,
    ),
  );

const buildAllCourseEntries = (catalog: Catalog): DirectoryEntry[] =>
  catalog.flatMap((program) =>
    program.courses.map((course) =>
      buildCourseEntry("courses", program, course, program.name),
    ),
  );

const buildNoteEntriesForCourse = (
  section: DirectorySection,
  program: CatalogProgram,
  course: CatalogCourse,
): DirectoryEntry[] =>
  course.notes.map((note) =>
    buildNoteEntry(
      section,
      program,
      course,
      note,
      `${note.items.length} files`,
    ),
  );

const buildNoteEntriesForProgram = (
  program: CatalogProgram,
): DirectoryEntry[] =>
  program.courses.flatMap((course) =>
    course.notes.map((note) =>
      buildNoteEntry("notes", program, course, note, course.name),
    ),
  );

const buildAllNoteEntries = (catalog: Catalog): DirectoryEntry[] =>
  catalog.flatMap((program) =>
    program.courses.flatMap((course) =>
      course.notes.map((note) =>
        buildNoteEntry(
          "notes",
          program,
          course,
          note,
          `${program.name} · ${course.name}`,
        ),
      ),
    ),
  );

const buildItemEntries = (note: CatalogNoteFolder): DirectoryEntry[] =>
  note.items.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    meta: item.type.toUpperCase(),
  }));

const buildProgramContext = (
  catalog: Catalog,
  ids: { programId?: string; courseId?: string; noteId?: string },
  errorMessage?: string,
): DirectoryContext => {
  const program = ids.programId
    ? catalog.find((entry) => entry.id === ids.programId)
    : undefined;
  const course =
    program && ids.courseId
      ? program.courses.find((entry) => entry.id === ids.courseId)
      : undefined;
  const note =
    program && course && ids.noteId
      ? course.notes.find((entry) => entry.id === ids.noteId)
      : undefined;

  if (!ids.programId) {
    return {
      title: "All Programs",
      level: "programs",
      entries: buildProgramEntries(catalog),
      breadcrumbs: buildBreadcrumbs("programs"),
      errorMessage,
    };
  }

  if (!program) {
    return {
      title: "Program Not Found",
      level: "programs",
      entries: buildProgramEntries(catalog),
      breadcrumbs: buildBreadcrumbs("programs"),
      errorMessage: errorMessage ?? "The requested program does not exist.",
    };
  }

  if (!ids.courseId) {
    return {
      title: program.name,
      level: "courses",
      entries: buildCourseEntriesForProgram("programs", program),
      breadcrumbs: buildBreadcrumbs("programs", program),
      errorMessage,
    };
  }

  if (!course) {
    return {
      title: "Course Not Found",
      level: "courses",
      entries: buildCourseEntriesForProgram("programs", program),
      breadcrumbs: buildBreadcrumbs("programs", program),
      errorMessage: errorMessage ?? "The requested course does not exist.",
    };
  }

  if (!ids.noteId) {
    return {
      title: course.name,
      level: "notes",
      entries: buildNoteEntriesForCourse("programs", program, course),
      breadcrumbs: buildBreadcrumbs("programs", program, course),
      errorMessage,
    };
  }

  if (!note) {
    return {
      title: "Notes Folder Not Found",
      level: "notes",
      entries: buildNoteEntriesForCourse("programs", program, course),
      breadcrumbs: buildBreadcrumbs("programs", program, course),
      errorMessage:
        errorMessage ?? "The requested notes folder does not exist.",
    };
  }

  return {
    title: note.name,
    level: "items",
    entries: buildItemEntries(note),
    breadcrumbs: buildBreadcrumbs("programs", program, course, note),
    errorMessage,
  };
};

const buildCourseContext = (
  catalog: Catalog,
  ids: { programId?: string; courseId?: string; noteId?: string },
  errorMessage?: string,
): DirectoryContext => {
  const program = ids.programId
    ? catalog.find((entry) => entry.id === ids.programId)
    : undefined;
  const course =
    program && ids.courseId
      ? program.courses.find((entry) => entry.id === ids.courseId)
      : undefined;
  const note =
    program && course && ids.noteId
      ? course.notes.find((entry) => entry.id === ids.noteId)
      : undefined;

  if (!ids.programId) {
    return {
      title: "All Courses",
      level: "courses",
      entries: buildAllCourseEntries(catalog),
      breadcrumbs: buildBreadcrumbs("courses"),
      errorMessage,
    };
  }

  if (!program) {
    return {
      title: "Program Not Found",
      level: "courses",
      entries: buildAllCourseEntries(catalog),
      breadcrumbs: buildBreadcrumbs("courses"),
      errorMessage: errorMessage ?? "The requested program does not exist.",
    };
  }

  if (!ids.courseId) {
    return {
      title: program.name,
      level: "courses",
      entries: buildCourseEntriesForProgram("courses", program),
      breadcrumbs: buildBreadcrumbs("courses", program),
      errorMessage,
    };
  }

  if (!course) {
    return {
      title: "Course Not Found",
      level: "courses",
      entries: buildCourseEntriesForProgram("courses", program),
      breadcrumbs: buildBreadcrumbs("courses", program),
      errorMessage: errorMessage ?? "The requested course does not exist.",
    };
  }

  if (!ids.noteId) {
    return {
      title: course.name,
      level: "notes",
      entries: buildNoteEntriesForCourse("courses", program, course),
      breadcrumbs: buildBreadcrumbs("courses", program, course),
      errorMessage,
    };
  }

  if (!note) {
    return {
      title: "Notes Folder Not Found",
      level: "notes",
      entries: buildNoteEntriesForCourse("courses", program, course),
      breadcrumbs: buildBreadcrumbs("courses", program, course),
      errorMessage:
        errorMessage ?? "The requested notes folder does not exist.",
    };
  }

  return {
    title: note.name,
    level: "items",
    entries: buildItemEntries(note),
    breadcrumbs: buildBreadcrumbs("courses", program, course, note),
    errorMessage,
  };
};

const buildNotesContext = (
  catalog: Catalog,
  ids: { programId?: string; courseId?: string; noteId?: string },
  errorMessage?: string,
): DirectoryContext => {
  const program = ids.programId
    ? catalog.find((entry) => entry.id === ids.programId)
    : undefined;
  const course =
    program && ids.courseId
      ? program.courses.find((entry) => entry.id === ids.courseId)
      : undefined;
  const note =
    program && course && ids.noteId
      ? course.notes.find((entry) => entry.id === ids.noteId)
      : undefined;

  if (!ids.programId) {
    return {
      title: "All Notes",
      level: "notes",
      entries: buildAllNoteEntries(catalog),
      breadcrumbs: buildBreadcrumbs("notes"),
      errorMessage,
    };
  }

  if (!program) {
    return {
      title: "Program Not Found",
      level: "notes",
      entries: buildAllNoteEntries(catalog),
      breadcrumbs: buildBreadcrumbs("notes"),
      errorMessage: errorMessage ?? "The requested program does not exist.",
    };
  }

  if (!ids.courseId) {
    return {
      title: program.name,
      level: "notes",
      entries: buildNoteEntriesForProgram(program),
      breadcrumbs: buildBreadcrumbs("notes", program),
      errorMessage,
    };
  }

  if (!course) {
    return {
      title: "Course Not Found",
      level: "notes",
      entries: buildNoteEntriesForProgram(program),
      breadcrumbs: buildBreadcrumbs("notes", program),
      errorMessage: errorMessage ?? "The requested course does not exist.",
    };
  }

  if (!ids.noteId) {
    return {
      title: course.name,
      level: "notes",
      entries: buildNoteEntriesForCourse("notes", program, course),
      breadcrumbs: buildBreadcrumbs("notes", program, course),
      errorMessage,
    };
  }

  if (!note) {
    return {
      title: "Notes Folder Not Found",
      level: "notes",
      entries: buildNoteEntriesForCourse("notes", program, course),
      breadcrumbs: buildBreadcrumbs("notes", program, course),
      errorMessage:
        errorMessage ?? "The requested notes folder does not exist.",
    };
  }

  return {
    title: note.name,
    level: "items",
    entries: buildItemEntries(note),
    breadcrumbs: buildBreadcrumbs("notes", program, course, note),
    errorMessage,
  };
};

export const buildDirectoryContext = (
  catalog: Catalog,
  pathSegments: string[],
  errorMessage?: string,
): DirectoryContext => {
  const { section, offset } = parseSection(pathSegments);
  const [programId, courseId, noteId] = pathSegments.slice(offset);

  const ids = { programId, courseId, noteId };

  if (section === "courses") {
    return buildCourseContext(catalog, ids, errorMessage);
  }

  if (section === "notes") {
    return buildNotesContext(catalog, ids, errorMessage);
  }

  return buildProgramContext(catalog, ids, errorMessage);
};
