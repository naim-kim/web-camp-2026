import React, { useState, useEffect } from "react";
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
  MapPin,
  Link as LinkIcon,
  Briefcase,
  GraduationCap,
  Loader2,
  Mail,
  Twitter,
  Linkedin,
  Globe,
  TrendingUp,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Activity,
} from "lucide-react";

export default function SummaryBuilder() {
  const [isEditMode, setIsEditMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("naim-kim");
  const [githubToken, setGithubToken] = useState(""); // Optional for higher rate limits

  // --- GITHUB DATA ---
  const [userProfile, setUserProfile] = useState({
    name: "김너임",
    bio: "Full-stack Developer",
    location: "Seoul, Korea",
    avatar: "",
    public_repos: 0,
    followers: 0,
    following: 0,
    blog: "",
    email: "",
    twitter: "",
    company: "",
  });

  const [repos, setRepos] = useState([]);
  const [pinnedRepos, setPinnedRepos] = useState([]);

  // NEW: Contribution Stats
  const [contributionStats, setContributionStats] = useState({
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    contributionDays: 0,
  });

  // NEW: Rate Limit Info
  const [rateLimit, setRateLimit] = useState({
    remaining: null,
    limit: null,
    reset: null,
  });

  // Auto-generated from GitHub
  const [techStack, setTechStack] = useState([]);

  // --- MANUAL DATA ---
  const [education, setEducation] = useState([
    {
      id: 1,
      school: "OO대학교",
      degree: "컴퓨터공학 전공",
      period: "2020.03 - 재학 중",
      isVisible: true,
    },
  ]);

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: "Tech StartUp",
      role: "Frontend Intern",
      period: "2024.06 - 2024.08",
      isVisible: true,
    },
  ]);

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
      id: 4,
      semester: "2024-02",
      category: "비교과",
      item: "전공활동(HAPPY)",
      content: "PPS Camp / 나의첫웹서비스",
      isVisible: true,
    },
  ]);

  const [awards, setAwards] = useState([
    {
      id: 1,
      year: "2025",
      name: "교내 해커톤 대상",
      org: "소프트웨어 중심대학",
      isVisible: true,
      type: "교내",
    },
  ]);

  // Contact info (manual override)
  const [contactInfo, setContactInfo] = useState({
    email: "",
    linkedin: "",
    personalWebsite: "",
  });

  // Section Ordering
  const [sectionOrder, setSectionOrder] = useState([
    "stats",
    "education",
    "experience",
    "techStack",
    "repos",
    "mileage",
    "awards",
  ]);
  const [draggedSection, setDraggedSection] = useState(null);

  // Repo display preference
  const [repoSource, setRepoSource] = useState("pinned"); // 'pinned', 'stars', 'recent'
  const [repoLimit, setRepoLimit] = useState(12); // How many repos to display
  const [includeForks, setIncludeForks] = useState(false); // Include forked repos

  // --- UTILITY FUNCTIONS ---

  // Language color mapping
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-600",
      Python: "bg-blue-500",
      Java: "bg-red-500",
      "C++": "bg-pink-500",
      C: "bg-gray-600",
      Go: "bg-cyan-500",
      Rust: "bg-orange-600",
      Ruby: "bg-red-600",
      PHP: "bg-purple-500",
      Swift: "bg-orange-500",
      Kotlin: "bg-purple-600",
      Dart: "bg-blue-400",
      HTML: "bg-orange-400",
      CSS: "bg-blue-400",
      Vue: "bg-green-500",
      React: "bg-cyan-400",
    };
    return colors[language] || "bg-gray-400";
  };

  // Check rate limit
  const checkRateLimit = async () => {
    try {
      const headers = {};
      if (githubToken) {
        headers["Authorization"] = `token ${githubToken}`;
      }

      const res = await fetch("https://api.github.com/rate_limit", {
        headers,
      });
      const data = await res.json();

      setRateLimit({
        remaining: data.rate.remaining,
        limit: data.rate.limit,
        reset: new Date(data.rate.reset * 1000),
      });
    } catch (error) {
      console.error("Rate limit check failed:", error);
    }
  };

  // Fetch pinned repositories (GraphQL)
  const fetchPinnedRepos = async () => {
    if (!githubToken) {
      console.log("Token required for pinned repos");
      return [];
    }

    const query = `
      query {
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                description
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                }
                url
              }
            }
          }
        }
      }
    `;

    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.data?.user?.pinnedItems?.nodes) {
        return data.data.user.pinnedItems.nodes.map((repo) => ({
          id: repo.id,
          name: repo.name,
          desc: repo.description,
          lang: repo.primaryLanguage?.name || "Unknown",
          langColor: getLanguageColor(repo.primaryLanguage?.name),
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          url: repo.url,
          isVisible: true,
          isPinned: true,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch pinned repos:", error);
    }
    return [];
  };

  // Fetch README content
  const fetchRepoREADME = async (owner, repoName) => {
    try {
      const headers = { Accept: "application/vnd.github.v3.raw" };
      if (githubToken) {
        headers["Authorization"] = `token ${githubToken}`;
      }

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/readme`,
        { headers },
      );

      if (res.ok) {
        const text = await res.text();
        // Extract first 3 bullet points or features
        const bullets = text
          .split("\n")
          .filter((line) => line.trim().match(/^[-*]\s/))
          .slice(0, 3)
          .map((line) => line.replace(/^[-*]\s/, "").trim());
        return bullets;
      }
    } catch (error) {
      console.log(`No README for ${repoName}`);
    }
    return [];
  };

  // --- MAIN GITHUB DATA FETCHING ---
  const fetchGitHubData = async () => {
    setLoading(true);
    await checkRateLimit();

    try {
      const headers = {};
      if (githubToken) {
        headers["Authorization"] = `token ${githubToken}`;
      }

      // 1. Fetch User Profile
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers,
      });
      const userData = await userRes.json();

      setUserProfile({
        name: userData.name || userData.login,
        bio: userData.bio || "GitHub Developer",
        location: userData.location || "",
        avatar: userData.avatar_url,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        blog: userData.blog || "",
        email: userData.email || "",
        twitter: userData.twitter_username || "",
        company: userData.company || "",
      });

      // 2. Fetch ALL Repositories (with pagination) - EXCLUDING FORKS by default
      let allRepos = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const repoRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=stars&per_page=100&page=${page}`,
          { headers },
        );
        const repoData = await repoRes.json();

        if (repoData.length === 0) {
          hasMore = false;
        } else {
          // Filter out forked repositories unless includeForks is true
          const filteredRepos = includeForks
            ? repoData
            : repoData.filter((repo) => !repo.fork);
          allRepos = [...allRepos, ...filteredRepos];
          page++;
        }
      }

      const repoData = allRepos;

      console.log(
        `Found ${allRepos.length} ${includeForks ? "total" : "original"} repositories ${includeForks ? "" : "(forks excluded)"}`,
      );

      // 3. Generate Tech Stack from Languages
      const languageCounts = {};
      repoData.forEach((repo) => {
        if (repo.language) {
          languageCounts[repo.language] =
            (languageCounts[repo.language] || 0) + 1;
        }
      });

      const detectedLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({
          name,
          color: getLanguageColor(name),
          count,
          isVisible: true,
        }));

      setTechStack(detectedLanguages);

      // 4. Format Repositories (show top 12 by stars, but keep all data)
      const formattedRepos = await Promise.all(
        repoData.slice(0, 12).map(async (r) => {
          const highlights = await fetchRepoREADME(username, r.name);
          return {
            id: r.id,
            name: r.name,
            fullName: r.full_name,
            desc: r.description,
            lang: r.language || "Plain Text",
            langColor: getLanguageColor(r.language),
            stars: r.stargazers_count,
            forks: r.forks_count,
            url: r.html_url,
            highlights: highlights,
            isVisible: true,
            isPinned: false,
          };
        }),
      );

      setRepos(formattedRepos);

      // Store total repo count for reference
      console.log(`Fetched ${allRepos.length} total repositories`);

      // 5. Fetch Pinned Repos (if token available)
      if (githubToken) {
        const pinned = await fetchPinnedRepos();
        setPinnedRepos(pinned);
      }

      // 6. Fetch Contribution Stats
      const eventsRes = await fetch(
        `https://api.github.com/users/${username}/events/public?per_page=100`,
        { headers },
      );
      const eventsData = await eventsRes.json();

      const commitCount = eventsData
        .filter((e) => e.type === "PushEvent")
        .reduce((acc, e) => acc + (e.payload.commits?.length || 0), 0);

      const prCount = eventsData.filter(
        (e) => e.type === "PullRequestEvent",
      ).length;
      const issueCount = eventsData.filter(
        (e) => e.type === "IssuesEvent",
      ).length;

      // Get unique contribution days
      const contributionDays = new Set(
        eventsData.map((e) => e.created_at.split("T")[0]),
      ).size;

      setContributionStats({
        totalCommits: commitCount,
        totalPRs: prCount,
        totalIssues: issueCount,
        contributionDays,
      });

      await checkRateLimit(); // Update rate limit after fetching
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      alert("Failed to fetch GitHub data. Check username or rate limit.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  // --- HANDLERS ---
  const handleDragStart = (section) => setDraggedSection(section);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (targetSection) => {
    if (!draggedSection || draggedSection === targetSection) return;
    const newOrder = [...sectionOrder];
    newOrder.splice(newOrder.indexOf(draggedSection), 1);
    newOrder.splice(newOrder.indexOf(targetSection), 0, draggedSection);
    setSectionOrder(newOrder);
    setDraggedSection(null);
  };

  const toggleVisibility = (id, state, setState) => {
    setState(
      state.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item,
      ),
    );
  };

  // --- COMPONENTS ---
  const SectionHeader = ({ icon: Icon, title, id }) => (
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
      {isEditMode && (
        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
      )}
      <Icon className="w-6 h-6" /> {title}
    </h2>
  );

  // NEW: Contribution Stats Section
  const StatsSection = () => (
    <div
      className="mb-10"
      draggable={isEditMode}
      onDragStart={() => handleDragStart("stats")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("stats")}
    >
      <SectionHeader icon={Activity} title="GitHub Activity" id="stats" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <GitCommit className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Commits</span>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {contributionStats.totalCommits}+
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <GitPullRequest className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Pull Requests</span>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {contributionStats.totalPRs}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Active Days</span>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {contributionStats.contributionDays}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <Star className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Repositories</span>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {userProfile.public_repos}
          </div>
        </div>
      </div>
    </div>
  );

  const ExperienceSection = () => (
    <div
      className="mb-10"
      draggable={isEditMode}
      onDragStart={() => handleDragStart("experience")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("experience")}
    >
      <SectionHeader icon={Briefcase} title="Work Experience" id="experience" />
      <div className="space-y-4">
        {experience.map(
          (exp) =>
            (isEditMode || exp.isVisible) && (
              <div
                key={exp.id}
                className={`flex justify-between items-start ${!exp.isVisible ? "opacity-30" : ""}`}
              >
                <div>
                  <h3 className="font-bold text-gray-900">{exp.company}</h3>
                  <p className="text-sm text-gray-600">{exp.role}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">
                    {exp.period}
                  </span>
                  {isEditMode && (
                    <button
                      onClick={() =>
                        toggleVisibility(exp.id, experience, setExperience)
                      }
                    >
                      {exp.isVisible ? (
                        <Eye className="w-4 h-4 text-gray-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-300" />
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

  const EducationSection = () => (
    <div
      className="mb-10"
      draggable={isEditMode}
      onDragStart={() => handleDragStart("education")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("education")}
    >
      <SectionHeader icon={GraduationCap} title="Education" id="education" />
      <div className="space-y-4">
        {education.map(
          (edu) =>
            (isEditMode || edu.isVisible) && (
              <div
                key={edu.id}
                className={`flex justify-between items-start ${!edu.isVisible ? "opacity-30" : ""}`}
              >
                <div>
                  <h3 className="font-bold text-gray-900">{edu.school}</h3>
                  <p className="text-sm text-gray-600">{edu.degree}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">
                    {edu.period}
                  </span>
                  {isEditMode && (
                    <button
                      onClick={() =>
                        toggleVisibility(edu.id, education, setEducation)
                      }
                    >
                      {edu.isVisible ? (
                        <Eye className="w-4 h-4 text-gray-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-300" />
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

  const TechStackSection = () => (
    <div
      className="mb-10"
      draggable={isEditMode}
      onDragStart={() => handleDragStart("techStack")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("techStack")}
    >
      <SectionHeader icon={Code2} title="Tech Stack" id="techStack" />
      <div className="flex flex-wrap gap-2">
        {techStack.map(
          (tech) =>
            (isEditMode || tech.isVisible) && (
              <span
                key={tech.name}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium ${!tech.isVisible ? "opacity-30" : "bg-white"}`}
              >
                <Circle className={`w-2 h-2 ${tech.color} fill-current`} />
                {tech.name}
                <span className="text-[10px] text-gray-400 ml-1">
                  ({tech.count})
                </span>
              </span>
            ),
        )}
      </div>
      {isEditMode && (
        <p className="text-xs text-gray-400 mt-2">
          Auto-generated from repository languages
        </p>
      )}
    </div>
  );

  const ReposSection = () => {
    const displayRepos =
      repoSource === "pinned" && pinnedRepos.length > 0 ? pinnedRepos : repos;

    return (
      <div
        className="mb-10"
        draggable={isEditMode}
        onDragStart={() => handleDragStart("repos")}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop("repos")}
      >
        <div className="flex items-center justify-between mb-4">
          <SectionHeader
            icon={Github}
            title="Featured Repositories"
            id="repos"
          />
          {isEditMode && (
            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-1 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={includeForks}
                  onChange={(e) => setIncludeForks(e.target.checked)}
                  className="rounded"
                />
                Include Forks
              </label>
              {pinnedRepos.length > 0 && (
                <select
                  value={repoSource}
                  onChange={(e) => setRepoSource(e.target.value)}
                  className="text-xs border px-2 py-1 rounded"
                >
                  <option value="pinned">Pinned</option>
                  <option value="stars">Top Starred</option>
                </select>
              )}
              <select
                value={repoLimit}
                onChange={(e) => setRepoLimit(Number(e.target.value))}
                className="text-xs border px-2 py-1 rounded"
              >
                <option value={6}>Show 6</option>
                <option value={12}>Show 12</option>
                <option value={20}>Show 20</option>
                <option value={999}>Show All</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayRepos.slice(0, repoLimit).map(
            (repo) =>
              (isEditMode || repo.isVisible) && (
                <div
                  key={repo.id}
                  className={`p-4 rounded-xl border border-gray-100 bg-white shadow-sm ${!repo.isVisible ? "opacity-30" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-blue-600 text-sm truncate max-w-[80%]">
                      <Book className="w-3 h-3" />
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {repo.name}
                      </a>
                      {repo.isPinned && (
                        <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                          PINNED
                        </span>
                      )}
                    </div>
                    {isEditMode && (
                      <button
                        onClick={() =>
                          toggleVisibility(
                            repo.id,
                            displayRepos,
                            repoSource === "pinned" ? setPinnedRepos : setRepos,
                          )
                        }
                      >
                        {repo.isVisible ? (
                          <Eye className="w-4 h-4 text-gray-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-300" />
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {repo.desc || "No description"}
                  </p>

                  {repo.highlights && repo.highlights.length > 0 && (
                    <ul className="text-[10px] text-gray-600 mb-2 space-y-0.5">
                      {repo.highlights.slice(0, 2).map((h, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-gray-400">•</span>
                          <span className="line-clamp-1">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Circle
                        className={`w-2 h-2 ${repo.langColor} fill-current`}
                      />
                      {repo.lang}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" /> {repo.forks}
                    </span>
                  </div>
                </div>
              ),
          )}
        </div>
        {isEditMode && (
          <p className="text-xs text-gray-400 mt-3">
            {includeForks
              ? "📦 Showing all repositories (including forks)"
              : "✨ Showing only your original work (forks excluded)"}
          </p>
        )}
      </div>
    );
  };

  const MileageSection = () => (
    <div
      className="mb-10"
      draggable={isEditMode}
      onDragStart={() => handleDragStart("mileage")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("mileage")}
    >
      <SectionHeader icon={BookOpen} title="Mileage" id="mileage" />
      <div className="space-y-2">
        {mileage.map(
          (m) =>
            (isEditMode || m.isVisible) && (
              <div
                key={m.id}
                className={`flex items-center gap-4 text-sm ${!m.isVisible ? "opacity-30" : ""}`}
              >
                <span className="font-mono text-xs text-gray-400 w-16">
                  {m.semester}
                </span>
                <span className="font-bold text-gray-700 w-12">
                  {m.category}
                </span>
                <span className="text-gray-600 flex-1">{m.content}</span>
                {isEditMode && (
                  <button
                    onClick={() => toggleVisibility(m.id, mileage, setMileage)}
                  >
                    {m.isVisible ? (
                      <Eye className="w-4 h-4 text-gray-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                )}
              </div>
            ),
        )}
      </div>
    </div>
  );

  const AwardsSection = () => (
    <div
      className="mb-10"
      draggable={isEditMode}
      onDragStart={() => handleDragStart("awards")}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop("awards")}
    >
      <SectionHeader icon={Award} title="Awards & Honors" id="awards" />
      <div className="space-y-3">
        {awards.map(
          (award) =>
            (isEditMode || award.isVisible) && (
              <div
                key={award.id}
                className={`flex justify-between items-start ${!award.isVisible ? "opacity-30" : ""}`}
              >
                <div>
                  <h3 className="font-bold text-gray-900">{award.name}</h3>
                  <p className="text-sm text-gray-600">{award.org}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">
                    {award.year}
                  </span>
                  {isEditMode && (
                    <button
                      onClick={() =>
                        toggleVisibility(award.id, awards, setAwards)
                      }
                    >
                      {award.isVisible ? (
                        <Eye className="w-4 h-4 text-gray-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-300" />
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
    stats: StatsSection,
    education: EducationSection,
    experience: ExperienceSection,
    techStack: TechStackSection,
    repos: ReposSection,
    mileage: MileageSection,
    awards: AwardsSection,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center gap-6">
      {/* Control Bar */}
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3 sticky top-4 z-50">
        {/* Top Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <input
              className="border px-3 py-1.5 rounded-lg text-sm font-mono w-40"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="GitHub ID"
            />
            <input
              className="border px-3 py-1.5 rounded-lg text-xs font-mono w-48"
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="Token (optional, for pinned repos)"
            />
            <button
              onClick={fetchGitHubData}
              disabled={loading}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Github className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-4 py-2 text-sm font-bold bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              {isEditMode ? "Preview" : "Edit"}
            </button>
            <button className="px-4 py-2 text-sm font-bold bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800">
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>

        {/* Rate Limit Info */}
        {rateLimit.remaining !== null && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="w-3 h-3" />
            <span>
              API Rate Limit: {rateLimit.remaining}/{rateLimit.limit} remaining
              {rateLimit.reset &&
                ` (resets at ${rateLimit.reset.toLocaleTimeString()})`}
            </span>
          </div>
        )}
      </div>

      {/* Main Document */}
      <div
        className={`w-full max-w-4xl bg-white shadow-2xl p-16 min-h-[1200px] transition-all ${isEditMode ? "ring-2 ring-blue-100 ring-offset-4" : ""}`}
      >
        {/* Enhanced Header */}
        <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-10">
          <div className="flex gap-6 items-center">
            {userProfile.avatar && (
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-2xl grayscale"
              />
            )}
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                {userProfile.name}
              </h1>
              <p className="text-gray-500 font-medium">{userProfile.bio}</p>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-3 mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                {userProfile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {userProfile.location}
                  </span>
                )}
                {(contactInfo.email || userProfile.email) && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {contactInfo.email || userProfile.email}
                  </span>
                )}
                {userProfile.blog && (
                  <a
                    href={userProfile.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Globe className="w-3 h-3" /> Website
                  </a>
                )}
                {userProfile.twitter && (
                  <span className="flex items-center gap-1">
                    <Twitter className="w-3 h-3" /> @{userProfile.twitter}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-gray-900 text-white px-4 py-3 rounded-xl">
              <div className="text-2xl font-black">
                {userProfile.public_repos}
              </div>
              <div className="text-[10px] uppercase font-bold text-gray-400">
                Repositories
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Sections */}
        {sectionOrder.map((key) => {
          const Component = sectionComponents[key];
          return Component ? <Component key={key} /> : null;
        })}
      </div>
    </div>
  );
}
