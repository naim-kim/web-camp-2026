import React, { useState, useEffect } from "react";
import {
  Eye, EyeOff, Plus, Trash2, Github, Award, BookOpen, Download, Star,
  GitFork, Circle, Book, GripVertical, Code2, MapPin, Link as LinkIcon,
  Briefcase, GraduationCap, Loader2, Mail, Twitter, Linkedin, Globe,
  TrendingUp, GitCommit, GitPullRequest, AlertCircle, Activity,
} from "lucide-react";

export default function SummaryBuilder() {
  // ==========================================
  // 1. UI & CONFIGURATION STATE
  // ==========================================
  const [isEditMode, setIsEditMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("naim-kim");
  const [githubToken, setGithubToken] = useState(""); // Optional for higher rate limits

  // ==========================================
  // 2. GITHUB DATA STATE
  // ==========================================
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
  const [techStack, setTechStack] = useState([]);
  
  const [contributionStats, setContributionStats] = useState({
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    contributionDays: 0,
  });

  const [rateLimit, setRateLimit] = useState({
    remaining: null,
    limit: null,
    reset: null,
  });

  // ==========================================
  // 3. MANUAL RESUME DATA STATE
  // ==========================================
  const [education, setEducation] = useState([
    { id: 1, school: "OO대학교", degree: "컴퓨터공학 전공", period: "2020.03 - 재학 중", isVisible: true },
  ]);

  const [experience, setExperience] = useState([
    { id: 1, company: "Tech StartUp", role: "Frontend Intern", period: "2024.06 - 2024.08", isVisible: true },
  ]);

  const [mileage, setMileage] = useState([
    { id: 1, semester: "2024-02", category: "전공", item: "MS 교과 이수", content: "선형대수학", isVisible: true },
    { id: 4, semester: "2024-02", category: "비교과", item: "전공활동(HAPPY)", content: "PPS Camp / 나의첫웹서비스", isVisible: true },
  ]);

  const [awards, setAwards] = useState([
    { id: 1, year: "2025", name: "교내 해커톤 대상", org: "소프트웨어 중심대학", isVisible: true, type: "교내" },
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: "",
    linkedin: "",
    personalWebsite: "",
  });

  // ==========================================
  // 4. DRAG & DROP / DISPLAY SETTINGS
  // ==========================================
  const [sectionOrder, setSectionOrder] = useState([
    "stats", "education", "experience", "techStack", "repos", "mileage", "awards",
  ]);
  const [draggedSection, setDraggedSection] = useState(null);
  const [repoSource, setRepoSource] = useState("pinned"); // 'pinned', 'stars', 'recent'
  const [repoLimit, setRepoLimit] = useState(12);
  const [includeForks, setIncludeForks] = useState(false);

  // ==========================================
  // 5. UTILITY & API FUNCTIONS
  // ==========================================

  /**
   * Returns a Tailwind color class based on programming language
   */
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-600",
      Python: "bg-blue-500",
      Java: "bg-red-500",
      "C++": "bg-pink-500",
      React: "bg-cyan-400",
      // ... default case
    };
    return colors[language] || "bg-gray-400";
  };

  /**
   * Checks the remaining GitHub API quota
   */
  const checkRateLimit = async () => {
    try {
      const headers = githubToken ? { "Authorization": `token ${githubToken}` } : {};
      const res = await fetch("https://api.github.com/rate_limit", { headers });
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

  /**
   * Fetches GitHub Pinned items using GraphQL (requires token)
   */
  const fetchPinnedRepos = async () => {
    if (!githubToken) return [];
    const query = `query { user(login: "${username}") { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { id name description stargazerCount forkCount primaryLanguage { name } url } } } } }`;
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${githubToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      return data.data?.user?.pinnedItems?.nodes.map(repo => ({
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
      })) || [];
    } catch (error) {
      console.error("Pinned repos fetch failed", error);
      return [];
    }
  };

  /**
   * Parses README for specific bullet points
   */
  const fetchRepoREADME = async (owner, repoName) => {
    try {
      const headers = { Accept: "application/vnd.github.v3.raw" };
      if (githubToken) headers["Authorization"] = `token ${githubToken}`;
      const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, { headers });
      if (res.ok) {
        const text = await res.text();
        return text.split("\n")
          .filter((line) => line.trim().match(/^[-*]\s/))
          .slice(0, 3)
          .map((line) => line.replace(/^[-*]\s/, "").trim());
      }
    } catch (e) { return []; }
    return [];
  };

  /**
   * Main orchestrator for fetching all GitHub data
   */
  const fetchGitHubData = async () => {
    setLoading(true);
    await checkRateLimit();
    try {
      const headers = githubToken ? { "Authorization": `token ${githubToken}` } : {};

      // 1. Fetch Profile
      const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
      const userData = await userRes.json();
      setUserProfile({
        name: userData.name || userData.login,
        bio: userData.bio,
        location: userData.location,
        avatar: userData.avatar_url,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        blog: userData.blog,
        email: userData.email,
        twitter: userData.twitter_username,
        company: userData.company,
      });

      // 2. Fetch Repos with Pagination
      let allRepos = [];
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100&page=${page}`, { headers });
        const repoData = await repoRes.json();
        if (repoData.length === 0) hasMore = false;
        else {
          const filtered = includeForks ? repoData : repoData.filter(r => !r.fork);
          allRepos = [...allRepos, ...filtered];
          page++;
        }
      }

      // 3. Process Tech Stack
      const languageCounts = {};
      allRepos.forEach(r => { if (r.language) languageCounts[r.language] = (languageCounts[r.language] || 0) + 1; });
      setTechStack(Object.entries(languageCounts).sort((a,b) => b[1]-a[1]).slice(0,8).map(([name, count]) => ({
        name, color: getLanguageColor(name), count, isVisible: true
      })));

      // 4. Process Featured Repos
      const formatted = await Promise.all(allRepos.slice(0, 12).map(async (r) => ({
        id: r.id, name: r.name, desc: r.description, lang: r.language || "Plain Text",
        langColor: getLanguageColor(r.language), stars: r.stargazers_count, forks: r.forks_count,
        url: r.html_url, highlights: await fetchRepoREADME(username, r.name), isVisible: true
      })));
      setRepos(formatted);

      // 5. Pinned Repos
      if (githubToken) setPinnedRepos(await fetchPinnedRepos());

      // 6. Stats from Events
      const evRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers });
      const evData = await evRes.json();
      setContributionStats({
        totalCommits: evData.filter(e => e.type === "PushEvent").reduce((acc, e) => acc + (e.payload.commits?.length || 0), 0),
        totalPRs: evData.filter(e => e.type === "PullRequestEvent").length,
        totalIssues: evData.filter(e => e.type === "IssuesEvent").length,
        contributionDays: new Set(evData.map(e => e.created_at.split("T")[0])).size,
      });

      await checkRateLimit();
    } catch (err) {
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGitHubData(); }, []);

  // ==========================================
  // 6. UI EVENT HANDLERS
  // ==========================================
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
    setState(state.map((item) => item.id === id ? { ...item, isVisible: !item.isVisible } : item));
  };

  // ==========================================
  // 7. SUB-COMPONENTS (UI SECTIONS)
  // ==========================================
  const SectionHeader = ({ icon: Icon, title }) => (
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
      {isEditMode && <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />}
      <Icon className="w-6 h-6" /> {title}
    </h2>
  );

  const StatsSection = () => ( /* ... JSX Logic ... */ );
  const ExperienceSection = () => ( /* ... JSX Logic ... */ );
  const EducationSection = () => ( /* ... JSX Logic ... */ );
  const TechStackSection = () => ( /* ... JSX Logic ... */ );
  const ReposSection = () => ( /* ... JSX Logic ... */ );
  const MileageSection = () => ( /* ... JSX Logic ... */ );
  const AwardsSection = () => ( /* ... JSX Logic ... */ );

  const sectionComponents = {
    stats: StatsSection,
    education: EducationSection,
    experience: ExperienceSection,
    techStack: TechStackSection,
    repos: ReposSection,
    mileage: MileageSection,
    awards: AwardsSection,
  };

  // ==========================================
  // 8. MAIN RENDER
  // ==========================================

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
