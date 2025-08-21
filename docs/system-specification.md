系统描述
请创建一个基于AI的公众号内容管理系统，通过自动化内容采集、AI改写、智能配图和一键发布，帮助内容创作者提升工作效率。
技术要求
- 前端框架: Next.js 14 + React 18 + TypeScript
- 样式: Tailwind CSS
- 状态管理: React Hooks (useState, useEffect, useContext)
- UI组件: 使用现代化的组件设计，支持暗色/亮色主题
- 响应式设计: 支持桌面端和移动端适配
- 数据存储: 使用内存存储模拟数据（不使用localStorage）
核心功能模块
1. 用户界面结构
创建一个现代化的单页应用，包含以下主要区域：
- 顶部导航栏: 包含系统Logo、用户信息
- 侧边栏导航: 功能模块导航菜单
- 主内容区: 动态显示不同功能模块的内容
2. 内容采集模块
实现内容采集界面，包含：
- 采集控制面板: 
  - 平台选择器（微信公众号、知乎、百度热搜、微博）
  - 采集方式选择（一键采集/关键词采集）
  - 关键词输入框和高级筛选选项
  - 开始采集按钮
- 采集结果展示: 
  - 采集到的文章列表预览
  - 去重统计信息
- 模拟数据: 
const mockArticles = [  {    id: "1",    title: "人工智能如何改变内容创作行业",    content: "随着AI技术的快速发展...",    source: "微信公众号",    sourceUrl: "https://example.com/article1",    author: "科技观察者",    publishTime: "2024-01-15T10:30:00Z",    collectTime: "2024-01-16T08:00:00Z",    tags: ["AI", "内容创作", "科技"],    category: "科技",    readCount: 5240,    likeCount: 328,    status: "pending"  }]
3. 素材管理模块
创建素材管理界面：
- 素材列表视图: 
  - 表格形式展示素材信息（标题、来源、状态、时间等）
  - 支持列表和卡片两种展示模式
  - 状态标签（待处理/已改写/已发布）
- 筛选和搜索: 
  - 顶部搜索框（支持标题搜索）
  - 筛选器面板（来源平台、分类、标签、时间范围、状态）
  - 高级筛选选项
- 批量操作: 
  - 全选/反选功能
  - 批量分类、标签、删除操作
- 素材详情: 
  - 弹窗或侧边栏显示完整素材信息
  - 支持编辑标题、分类、标签
4. AI改写模块
实现AI改写功能：
- 改写界面: 
  - 左右分栏布局（原文 vs 改写结果）
  - 改写风格选择器（通用、专业、亲民、营销、自定义）
  - 自定义提示词输入区域
  - 改写按钮
- 改写风格配置: 
const rewriteStyles = {  general: {     name: "通用风格",     prompt: "请保持原文核心观点，优化语言表达，使内容更加流畅易读"   },  professional: {     name: "专业风格",     prompt: "请使用专业术语改写，增加权威性和专业性"   },  friendly: {     name: "亲民风格",     prompt: "请用通俗易懂的语言改写，贴近普通读者"   },  marketing: {     name: "营销风格",     prompt: "请增强感染力和说服力，适合营销推广"   }}
- 改写历史: 
  - 显示同一篇文章的多次改写记录
- 改写预览: 
  - 实时预览改写效果
  - 字数统计和变化对比
5. 自动配图模块
实现智能配图功能：
- 配图界面: 
  - 文章内容预览区域
  - 生成配图按钮
- 配图预览: 
  - 生成的图片预览区域
  - 支持重新生成和手动调整
  - 图片与文章段落的关联显示
- 配图管理: 
  - 已生成图片的管理界面
6. 发布模块
创建发布管理界面：
- 发布准备: 
  - 选择要发布的文章
  - 公众号账号选择器
  - 立即发布
- 发布预览: 
  - 模拟公众号文章展示效果
  - 图文混排预览
  - 发布前最终确认
- 发布历史: 
  - 已发布文章列表
  - 发布状态和数据统计
  - 发布记录详情查看
7. 配置管理模块
实现系统配置：
- AI接口配置: 
  - OpenRouter API密钥输入
  - AI模型选择（GPT-4、Claude等）
  - 接口参数设置
- 采集源配置: 
  - 各平台采集参数设置
  - 采集频率和规则配置
- 账号管理: 
  - 公众号账号添加和管理
  - 授权状态显示
UI/UX设计要求
视觉设计
- 现代化界面: 采用简洁、专业的设计风格
- 颜色方案: 
  - 主色调：蓝色系 (#3B82F6)
  - 辅助色：灰色系 (#64748B)
  - 成功色：绿色 (#10B981)
  - 警告色：橙色 (#F59E0B)
  - 错误色：红色 (#EF4444)
- 主题支持: 实现亮色和暗色主题切换
- 图标系统: 使用Lucide React图标库
交互设计
- 加载状态: 为所有异步操作添加加载指示器
- 错误处理: 友好的错误提示和重试机制
- 操作反馈: 成功/失败操作的Toast通知
- 确认对话框: 重要操作前的确认弹窗
- 快捷操作: 支持键盘快捷键
响应式设计
- 桌面端: 侧边栏导航 + 主内容区布局
- 移动端: 底部标签导航 + 全屏内容区
- 平板端: 自适应布局调整
数据模拟要求
状态管理
使用React Context创建全局状态管理：
// 创建数据上下文
const AppContext = createContext({
  materials: [],
  rewrites: [],
  publications: [],
  accounts: [],
  config: {}
});

// 提供模拟数据和操作方法
const AppProvider = ({ children }) => {
  const [materials, setMaterials] = useState(mockMaterials);
  const [rewrites, setRewrites] = useState([]);
  // ... 其他状态
};
模拟API调用
创建模拟API函数：
// 模拟内容采集
const mockCollectContent = async (platform, keyword) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  // 返回模拟数据
  return mockArticles.filter(article => 
    article.source === platform && 
    (!keyword || article.title.includes(keyword))
  );
};

// 模拟AI改写
const mockRewriteContent = async (content, style, customPrompt) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {
    title: content.title + " (已改写)",
    content: content.content + "\n\n[AI改写内容...]"
  };
};
功能实现细节
8. 实时更新
- 使用useState和useEffect实现状态更新
- 添加WebSocket模拟实时采集进度
- 实现乐观更新提升用户体验
9. 性能优化
- 使用React.memo优化组件渲染
- 实现虚拟滚动处理大量数据
- 图片懒加载和预览功能
10. 用户体验
- 添加骨架屏提升加载体验
- 实现拖拽排序功能
- 支持批量操作的进度展示
11. 错误边界
- 实现React Error Boundary
- 网络错误的重试机制
- 表单验证和错误提示
开发注意事项
1. 不要使用localStorage或sessionStorage - 所有数据保存在React状态中
2. 模拟真实场景 - 添加合理的加载时间和错误情况
3. 组件复用 - 创建可复用的UI组件
4. 代码组织 - 按功能模块组织代码结构
5. 类型安全 - 使用TypeScript确保类型安全
6. 无障碍访问 - 添加适当的ARIA标签和键盘导航
项目结构建议
src/
├── components/
│   ├── ui/           # 基础UI组件
│   ├── layout/       # 布局组件
│   └── modules/      # 功能模块组件
├── contexts/         # 全局状态管理
├── hooks/           # 自定义Hook
├── utils/           # 工具函数
├── types/           # TypeScript类型定义
└── data/            # 模拟数据
请根据以上要求创建一个完整、可用的公众号内容管理系统原型。确保所有功能都能正常演示，界面美观且用户体验良好。
