import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Github,
  Award,
  BookOpen,
  Download,
  Star,
  GitFork,
  Circle,
  Book,
  GripVertical,
  Code2,
} from "lucide-react";

export default function SummaryBuilder() {
  const [isEditMode, setIsEditMode] = useState(true);

  // Section order state - added "techStack"
  const [sectionOrder, setSectionOrder] = useState([
    "techStack",
    "mileage",
    "repos",
    "awards",
  ]);
  const [draggedSection, setDraggedSection] = useState(null);

  // Tech Stack state - more compact structure
  const [techStack, setTechStack] = useState([
    { name: "JavaScript", color: "bg-yellow-400", isVisible: true },
    { name: "Python", color: "bg-blue-500", isVisible: true },
    { name: "React", color: "bg-cyan-400", isVisible: true },
    { name: "TypeScript", color: "bg-blue-600", isVisible: true },
    { name: "Node.js", color: "bg-green-600", isVisible: true },
    { name: "Tailwind CSS", color: "bg-teal-400", isVisible: true },
    { name: "Next.js", color: "bg-black", isVisible: true },
    { name: "Express", color: "bg-gray-700", isVisible: true },
    { name: "Git", color: "bg-orange-600", isVisible: true },
    { name: "Docker", color: "bg-blue-400", isVisible: true },
    { name: "MongoDB", color: "bg-green-500", isVisible: false },
    { name: "PostgreSQL", color: "bg-blue-700", isVisible: false },
  ]);

  // 1. Mileage Data State
  const [mileage, setMileage] = useState([
    {
      id: 1,
      semester: "2024-02",
      category: "전공",
      item: "MS 교과 이수",
      content: "선형대수학",
      isVisible: true,
    },
    {
      id: 2,
      semester: "2024-02",
      category: "전공",
      item: "심화전공",
      content: "심화전공 이수",
      isVisible: true,
    },
    {
      id: 3,
      semester: "2024-02",
      category: "비교과",
      item: "연구활동",
      content: "경진 대회 수상_교내",
      isVisible: true,
    },
    {
      id: 4,
      semester: "2024-02",
      category: "비교과",
      item: "전공활동(HAPPY)",
      content: "PPS Camp / 나의첫웹서비스",
      isVisible: true,
    },
    {
      id: 5,
      semester: "2024-02",
      category: "산학",
      item: "산학 마일리지",
      content: "현장실습 co-up",
      isVisible: true,
    },
  ]);

  const [awards, setAwards] = useState([
    {
      id: 1,
      year: "2025",
      name: "교내 해커톤 대상",
      org: "소프트웨어 중심대학",
      date: "2025.11.20",
      isVisible: true,
      type: "교내",
    },
    {
      id: 2,
      year: "2024",
      name: "공개 SW 공모전 은상",
      org: "정보통신산업진흥원",
      date: "2024.08.15",
      isVisible: true,
      type: "교외",
    },
  ]);

  // Projects -> GitHub Repositories 스타일을 위한 데이터 확장
  const [repos, setRepos] = useState([
    {
      id: 1,
      name: "naim-kim / My-Web-Service",
      desc: "React 기반 쇼핑몰 서비스 - 결제 API 연동 및 상태 관리 최적화",
      lang: "JavaScript",
      langColor: "bg-yellow-400",
      stars: 12,
      forks: 3,
      isVisible: true,
    },
    {
      id: 2,
      name: "naim-kim / Algo-Study",
      desc: "백준 및 프로그래머스 알고리즘 문제 풀이 저장소",
      lang: "Python",
      langColor: "bg-blue-500",
      stars: 5,
      forks: 0,
      isVisible: false,
    },
  ]);

  const toggleAward = (id) => {
    setAwards(
      awards.map((a) => (a.id === id ? { ...a, isVisible: !a.isVisible } : a)),
    );
  };

  const toggleMileage = (id) => {
    setMileage(
      mileage.map((m) => (m.id === id ? { ...m, isVisible: !m.isVisible } : m)),
    );
  };

  const toggleTech = (techName) => {
    setTechStack(
      techStack.map((tech) =>
        tech.name === techName ? { ...tech, isVisible: !tech.isVisible } : tech,
      ),
    );
  };

  // Drag and drop handlers
  const handleDragStart = (section) => {
    setDraggedSection(section);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetSection) => {
    if (!draggedSection || draggedSection === targetSection) return;

    const newOrder = [...sectionOrder];
    const draggedIndex = newOrder.indexOf(draggedSection);
    const targetIndex = newOrder.indexOf(targetSection);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedSection);

    setSectionOrder(newOrder);
    setDraggedSection(null);
  };

  // Tech Stack Section Component - Compact version
  const TechStackSection = () => (
    <div
      className={`mb-12 ${isEditMode ? "cursor-move" : ""}`}
      draggable={isEditMode}
      onDragStart={() => handleDragStart("techStack")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("techStack")}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
        {isEditMode && <GripVertical className="w-5 h-5 text-gray-400" />}
        <Code2 className="w-6 h-6" /> Tech Stack
      </h2>

      <div className="flex flex-wrap gap-2">
        {techStack.map(
          (tech) =>
            (isEditMode || tech.isVisible) && (
              <div
                key={tech.name}
                className={`relative group ${!tech.isVisible ? "opacity-40 grayscale" : ""}`}
              >
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-all ${
                    !tech.isVisible
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Circle className={`w-2 h-2 ${tech.color} fill-current`} />
                  <span className="text-sm font-medium text-gray-700">
                    {tech.name}
                  </span>
                  {isEditMode && (
                    <button
                      onClick={() => toggleTech(tech.name)}
                      className="ml-1 text-gray-400 hover:text-blue-600"
                    >
                      {tech.isVisible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );

  // Section components
  const MileageSection = () => (
    <div
      className={`mb-12 ${isEditMode ? "cursor-move" : ""}`}
      draggable={isEditMode}
      onDragStart={() => handleDragStart("mileage")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("mileage")}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
        {isEditMode && <GripVertical className="w-5 h-5 text-gray-400" />}
        <BookOpen className="w-6 h-6" /> Mileage Status
      </h2>
      <div className="overflow-hidden border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">학기</th>
              <th className="px-4 py-3">카테고리</th>
              <th className="px-4 py-3">항목명</th>
              <th className="px-4 py-3">내용</th>
              {isEditMode && <th className="px-4 py-3 text-right">표시</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mileage.map(
              (m) =>
                (isEditMode || m.isVisible) && (
                  <tr
                    key={m.id}
                    className={`${!m.isVisible ? "opacity-30 bg-gray-50 grayscale" : "hover:bg-blue-50/30"} transition-colors`}
                  >
                    <td className="px-4 py-3 font-mono text-gray-600">
                      {m.semester}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.category === "전공"
                            ? "bg-blue-100 text-blue-700"
                            : m.category === "비교과"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {m.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {m.item}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{m.content}</td>
                    {isEditMode && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleMileage(m.id)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          {m.isVisible ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    )}
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ReposSection = () => (
    <div
      className={`mb-12 ${isEditMode ? "cursor-move" : ""}`}
      draggable={isEditMode}
      onDragStart={() => handleDragStart("repos")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("repos")}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isEditMode && <GripVertical className="w-5 h-5 text-gray-400" />}
          <Github className="w-6 h-6" /> Featured Repositories
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map(
          (repo) =>
            (isEditMode || repo.isVisible) && (
              <div
                key={repo.id}
                className={`p-5 rounded-xl border-2 transition-all relative ${
                  !repo.isVisible
                    ? "bg-gray-50 border-dashed border-gray-200 opacity-40 grayscale"
                    : "bg-white border-gray-100 shadow-sm hover:border-blue-200"
                }`}
              >
                {isEditMode && (
                  <button
                    onClick={() =>
                      setRepos(
                        repos.map((r) =>
                          r.id === repo.id
                            ? { ...r, isVisible: !r.isVisible }
                            : r,
                        ),
                      )
                    }
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {repo.isVisible ? (
                      <Eye className="w-4 h-4 text-blue-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <Book className="w-4 h-4 text-gray-400" />
                  <h3 className="font-bold text-blue-600 hover:underline cursor-pointer truncate pr-8">
                    {repo.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 border border-gray-200 rounded-full text-gray-400 font-medium">
                    Public
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-4 h-8 line-clamp-2 leading-relaxed">
                  {repo.desc}
                </p>

                <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Circle
                      className={`w-3 h-3 ${repo.langColor || "bg-gray-400"} fill-current`}
                    />
                    {repo.lang}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> {repo.stars || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> {repo.forks || 0}
                  </div>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );

  const AwardsSection = () => (
    <div
      className={`mb-12 ${isEditMode ? "cursor-move" : ""}`}
      draggable={isEditMode}
      onDragStart={() => handleDragStart("awards")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("awards")}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditMode && <GripVertical className="w-5 h-5 text-gray-400" />}
          Awards
        </div>
        {isEditMode && (
          <button className="text-xs flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
            <Plus className="w-3 h-3" /> 직접 추가
          </button>
        )}
      </h2>
      <div className="space-y-3">
        {awards.map(
          (award) =>
            (isEditMode || award.isVisible) && (
              <div
                key={award.id}
                className={`grid grid-cols-12 items-center text-sm p-3 rounded border border-transparent hover:bg-gray-50 transition-colors ${!award.isVisible ? "opacity-40 grayscale bg-gray-50" : ""}`}
              >
                <div className="col-span-1 text-gray-400 font-mono text-xs">
                  {award.year}
                </div>
                <div className="col-span-5 font-bold text-gray-900">
                  {award.name}
                </div>
                <div className="col-span-3 text-gray-500">{award.org}</div>
                <div className="col-span-3 flex justify-end items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${award.type === "교내" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
                  >
                    {award.type}
                  </span>
                  {isEditMode && (
                    <button
                      onClick={() => toggleAward(award.id)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      {award.isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );

  const sectionComponents = {
    techStack: TechStackSection,
    mileage: MileageSection,
    repos: ReposSection,
    awards: AwardsSection,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center gap-6 font-sans">
      {/* Control Bar */}
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-sm flex justify-between items-center sticky top-4 z-10 border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          나의 요약본 (Portfolio Summary)
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isEditMode ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
          >
            {isEditMode ? "편집 완료 (미리보기)" : "편집 하기"}
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800">
            <Download className="w-4 h-4" /> PDF 내보내기
          </button>
        </div>
      </div>

      <div
        className={`w-full max-w-4xl bg-white min-h-[1000px] shadow-lg p-12 transition-all ${isEditMode ? "border-2 border-dashed border-blue-300" : ""}`}
      >
        {/* 1. User Info */}
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              김너임
            </h1>
            <p className="text-gray-600 text-lg">Full-stack Developer</p>
          </div>
          <div className="text-right space-y-1 text-sm text-gray-600">
            <p>컴퓨터공학전공 / 시각디자인부전공</p>
            <p>example@email.com</p>
            <div className="flex items-center justify-end gap-1 text-gray-900 font-medium">
              <Github className="w-4 h-4" /> github.com/naim-kim
            </div>
          </div>
        </div>

        {/* Render sections in custom order */}
        {sectionOrder.map((sectionKey) => {
          const SectionComponent = sectionComponents[sectionKey];
          return <SectionComponent key={sectionKey} />;
        })}
      </div>
    </div>
  );
}
