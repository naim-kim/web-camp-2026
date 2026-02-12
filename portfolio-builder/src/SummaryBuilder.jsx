import React, { useState } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Github,
  Award,
  BookOpen,
  Code2,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";

export default function PortfolioBuilder() {
  const [isEditMode, setIsEditMode] = useState(true);

  // 1. 기본 정보
  const [userInfo, setUserInfo] = useState({
    name: "홍길동",
    bio: "백엔드 구조를 설계하고 개선하는 과정을 좋아하는 컴퓨터공학과 학생입니다.",
    location: "Seoul, Korea",
    website: "https://github.com/hong-gildong",
  });

  // 2. 기술 스택
  const [techStack, setTechStack] = useState([
    "Java",
    "Spring Boot",
    "JPA",
    "PostgreSQL",
    "Docker",
    "Redis",
  ]);

  // 3. GitHub 레포
  const [repos, setRepos] = useState([
    {
      id: 101,
      name: "ecommerce-core",
      customTitle: "이커머스 백엔드 핵심 도메인 구현",
      isVisible: true,
      stars: 12,
      lang: "Java",
    },
    {
      id: 102,
      name: "querydsl-helper",
      customTitle: "QueryDSL 기반 동적 쿼리 유틸리티",
      isVisible: true,
      stars: 8,
      lang: "Java",
    },
    {
      id: 103,
      name: "toy-chat-app",
      customTitle: "실시간 채팅 토이 프로젝트",
      isVisible: false,
      stars: 5,
      lang: "TypeScript",
    },
  ]);

  // 4. 활동
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: "구름톤 유니브 2기 해커톤",
      desc: "팀 프로젝트로 웹 서비스 기획 및 백엔드 API 개발을 담당, 최우수상 수상",
      date: "2024.01 - 2024.06",
    },
  ]);

  // 5. 마일리지
  const [mileages, setMileages] = useState([
    {
      id: 501,
      content: "Spring Framework 오픈소스 기여",
      additionalInfo:
        "오픈소스 컨트리뷰션 아카데미를 통해 이슈 분석 및 PR 제출 경험",
    },
  ]);

  // 6. 섹션 순서
  const [sectionOrder, setSectionOrder] = useState([
    "tech",
    "repo",
    "activities",
    "mileage",
  ]);
  const [draggedSection, setDraggedSection] = useState(null);

  const handleDragStart = (section) => {
    if (!isEditMode) return;
    setDraggedSection(section);
  };

  const handleDrop = (target) => {
    if (!draggedSection || draggedSection === target) return;
    const newOrder = [...sectionOrder];
    const fromIndex = newOrder.indexOf(draggedSection);
    const toIndex = newOrder.indexOf(target);
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedSection);
    setSectionOrder(newOrder);
  };

  const EditableText = ({ value, onChange, placeholder, className }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={!isEditMode}
      className={`bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 -ml-1 w-full transition-colors ${className}`}
    />
  );

  const SectionWrapper = ({ id, title, icon: Icon, children }) => (
    <div
      className="group relative mb-12"
      draggable={isEditMode}
      onDragStart={() => handleDragStart(id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(id)}
    >
      {isEditMode && (
        <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 cursor-grab">
          <GripVertical className="w-5 h-5 text-gray-300" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#37352F]">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-white/80 backdrop-blur border-b border-gray-100 flex items-center justify-between px-4 z-50">
        <span className="text-sm text-gray-500">활동 요약</span>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="px-3 py-1 rounded text-xs font-medium bg-gray-100 hover:bg-gray-200"
        >
          {isEditMode ? "편집 완료" : "편집"}
        </button>
      </div>

      <main className="max-w-3xl mx-auto pt-28 pb-32 px-6">
        {/* Profile */}
        <header className="mb-16">
          <EditableText
            value={userInfo.name}
            onChange={(v) => setUserInfo({ ...userInfo, name: v })}
            className="text-4xl font-bold mb-2"
          />
          <EditableText
            value={userInfo.bio}
            onChange={(v) => setUserInfo({ ...userInfo, bio: v })}
            className="text-lg text-gray-500"
          />
          <div className="flex gap-4 text-sm text-gray-400 mt-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {userInfo.location}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" /> {userInfo.website}
            </span>
          </div>
        </header>

        {sectionOrder.map((sectionId) => {
          if (sectionId === "tech")
            return (
              <SectionWrapper
                key="tech"
                id="tech"
                title="Tech Stack"
                icon={Code2}
              >
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </SectionWrapper>
            );

          if (sectionId === "repo")
            return (
              <SectionWrapper
                key="repo"
                id="repo"
                title="Projects (GitHub)"
                icon={Github}
              >
                <div className="space-y-3">
                  {repos.map(
                    (repo) =>
                      (isEditMode || repo.isVisible) && (
                        <div
                          key={repo.id}
                          className={`p-3 border rounded-lg ${!repo.isVisible ? "opacity-40" : ""}`}
                        >
                          <div className="flex justify-between">
                            <EditableText
                              value={repo.customTitle}
                              onChange={(v) =>
                                setRepos(
                                  repos.map((r) =>
                                    r.id === repo.id
                                      ? { ...r, customTitle: v }
                                      : r,
                                  ),
                                )
                              }
                              className="font-medium text-blue-600"
                            />
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
                              >
                                {repo.isVisible ? <Eye /> : <EyeOff />}
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {repo.lang} · ⭐ {repo.stars}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </SectionWrapper>
            );

          if (sectionId === "activities")
            return (
              <SectionWrapper
                key="activities"
                id="activities"
                title="Activities"
                icon={Award}
              >
                {activities.map((act) => (
                  <div key={act.id} className="mb-6">
                    <div className="font-semibold">{act.title}</div>
                    <div className="text-sm text-gray-500">{act.desc}</div>
                    <div className="text-xs text-gray-400 mt-1">{act.date}</div>
                  </div>
                ))}
              </SectionWrapper>
            );

          if (sectionId === "mileage")
            return (
              <SectionWrapper
                key="mileage"
                id="mileage"
                title="Mileage / 비교과"
                icon={BookOpen}
              >
                {mileages.map((m) => (
                  <div key={m.id} className="mb-4">
                    <div className="font-medium">{m.content}</div>
                    <div className="text-sm text-gray-500 italic">
                      {m.additionalInfo}
                    </div>
                  </div>
                ))}
              </SectionWrapper>
            );
          return null;
        })}
      </main>
    </div>
  );
}
