import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { sendChatMessage, ModelId, AVAILABLE_MODELS } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, ListTodo, Plus, Settings, Star, Trash2, MessageSquare, X, Maximize2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  evaluation?: string;
  createdAt: string;
  completedAt?: string;
  category: 'research' | 'planning' | 'implementation' | 'review' | 'other';
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
  deliverables: string[];
  successCriteria: string[];
  skills: string[];
}

interface Plan {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  schedule?: string;
  aiSuggestions?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  plans: Plan[];
}

const priorityColors = {
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  high: 'text-red-400 bg-red-400/10 border-red-400/20'
};

const statusColors = {
  'pending': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  'in-progress': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'completed': 'text-green-400 bg-green-400/10 border-green-400/20'
};

// Add new color constants for categories and complexity
const categoryColors = {
  research: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  planning: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  implementation: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  review: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  other: 'text-gray-400 bg-gray-400/10 border-gray-400/20'
};

const complexityColors = {
  low: 'text-green-400 bg-green-400/10 border-green-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  high: 'text-red-400 bg-red-400/10 border-red-400/20'
};

// Add task grouping options
type GroupBy = 'none' | 'category' | 'priority' | 'status';

export function TodoPlannerPage() {
  const { geminiKey } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelId>('gemini-1.5-pro');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isEvaluatingTask, setIsEvaluatingTask] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('todo-projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [initialPlanDescription, setInitialPlanDescription] = useState('');
  const [shouldCreatePlan, setShouldCreatePlan] = useState(false);
  const [numberOfPlans, setNumberOfPlans] = useState(1);
  const [fullScreenTask, setFullScreenTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('todo-projects', JSON.stringify(projects));
  }, [projects]);

  const generatePlanWithAI = async (description: string) => {
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    if (!geminiKey) {
      toast.error('Please add your Gemini API key in settings');
      return;
    }

    try {
      setIsGeneratingPlan(true);
      
      const messages = [
        {
          id: crypto.randomUUID(),
          role: 'user' as const,
          content: `You are an expert project planner and task management specialist. Create a detailed, actionable project plan with the following structure. Return ONLY valid JSON without any additional text or formatting.

Project Context:
Title: ${selectedProject.title}
Description: ${selectedProject.description}
Plan Request: ${description}

Required Plan Structure:
{
  "title": "Concise, specific plan title",
  "tasks": [
    {
      "title": "Clear, actionable task title",
      "description": "Detailed task description including:\\n\\n1. Objective: What needs to be accomplished\\n2. Approach: How to accomplish it\\n3. Expected Outcome: What success looks like\\n4. Potential Challenges: What to watch out for\\n\\nRecommended Resources:\\n• [Resource Name] - [Brief Description] (URL)\\n• [Tool/Library] - [Usage Context] (Documentation URL)\\n• [Reference] - [Why It's Relevant] (Link)",
      "priority": "low|medium|high",
      "estimatedDuration": "X hours/days",
      "dependencies": ["Task titles that must be completed first"],
      "category": "research|planning|implementation|review|other",
      "suggestedStartDate": "Day number in sequence",
      "complexity": "low|medium|high",
      "deliverables": ["Specific outputs or results expected from this task"],
      "successCriteria": ["Measurable criteria to determine task completion"],
      "skills": ["Required skills or expertise for this task"]
    }
  ],
  "schedule": "Detailed timeline with clear milestones:\\n\\nWeek 1:\\n- Days 1-2: [Specific tasks and goals]\\n- Days 3-5: [Next set of tasks]\\n\\nWeek 2:\\n[Continue with detailed breakdown]",
  "suggestions": "Strategic recommendations including:\\n\\n1. Resource Allocation:\\n   • How to distribute work effectively\\n   • Required tools and technologies\\n\\n2. Risk Mitigation:\\n   • Potential bottlenecks and solutions\\n   • Contingency plans\\n\\n3. Quality Assurance:\\n   • Review points and validation steps\\n   • Testing strategies\\n\\n4. Learning Path:\\n   • Skill development recommendations\\n   • Key concepts to master\\n\\n5. Success Metrics:\\n   • KPIs to track\\n   • Expected outcomes",
  "dependencies": {
    "taskDependencies": ["Task relationships and critical paths"],
    "externalDependencies": ["Required external resources, APIs, or services"],
    "prerequisites": ["Required setup or preparation steps"]
  },
  "risks": {
    "technical": ["Potential technical challenges and mitigation strategies"],
    "resource": ["Resource-related risks and solutions"],
    "timeline": ["Schedule risks and contingency plans"]
  }
}`
        }
      ];

      const response = await sendChatMessage(
        messages,
        geminiKey,
        'default',
        selectedModel
      );

      try {
        let cleanedContent = response.content
          .replace(/^[\s\S]*?```(?:json)?\s*/, '')
          .replace(/\s*```[\s\S]*$/, '')
          .trim();

        const aiResponse = JSON.parse(cleanedContent);

        if (!aiResponse.title || !Array.isArray(aiResponse.tasks)) {
          throw new Error('Invalid response format: missing required fields');
        }

        const tasks = aiResponse.tasks.map((task: any) => ({
          id: crypto.randomUUID(),
          title: task.title || 'Untitled Task',
          description: task.description || '',
          dueDate: (() => {
            const suggestedStart = parseInt(task.suggestedStartDate) || 1;
            const durationInDays = parseDuration(task.estimatedDuration || '1 day');
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + suggestedStart - 1);
            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + durationInDays);
            return dueDate.toISOString();
          })(),
          priority: task.priority || 'medium',
          status: 'pending',
          createdAt: new Date().toISOString(),
          category: task.category || 'other',
          complexity: task.complexity || 'medium',
          dependencies: task.dependencies || [],
          deliverables: task.deliverables || [],
          successCriteria: task.successCriteria || [],
          skills: task.skills || []
        }));

        const sortedTasks = sortTasksByDependencies(tasks);

        const newPlan: Plan = {
          id: crypto.randomUUID(),
          title: aiResponse.title,
          description: description,
          tasks: sortedTasks,
          createdAt: new Date().toISOString(),
          schedule: aiResponse.schedule,
          aiSuggestions: `${aiResponse.suggestions}\n\n## Dependencies\n${JSON.stringify(aiResponse.dependencies, null, 2)}\n\n## Risks\n${JSON.stringify(aiResponse.risks, null, 2)}`,
        };

        setProjects(prev => prev.map(project => 
          project.id === selectedProject.id
            ? { ...project, plans: [...project.plans, newPlan] }
            : project
        ));

        setSelectedProject(prev => prev ? {
          ...prev,
          plans: [...prev.plans, newPlan]
        } : prev);

        setSelectedPlan(newPlan);
        toast.success('Plan generated successfully!');
      } catch (error) {
        console.error('Error parsing AI response:', error);
        console.error('Raw response:', response.content);
        toast.error('Error creating plan. Please try again.');
        throw error;
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      toast.error('Error generating plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
      setIsCreatingPlan(false);
    }
  };

  // Helper function to parse duration strings into number of days
  const parseDuration = (duration: string): number => {
    const daysMatch = duration.match(/(\d+)\s*days?/i);
    const hoursMatch = duration.match(/(\d+)\s*hours?/i);
    
    let days = 0;
    if (daysMatch) days += parseInt(daysMatch[1]);
    if (hoursMatch) days += Math.ceil(parseInt(hoursMatch[1]) / 8); // Assuming 8-hour workdays
    
    return Math.max(1, days); // Minimum 1 day
  };

  // Helper function to sort tasks based on dependencies
  const sortTasksByDependencies = (tasks: Task[]): Task[] => {
    const taskMap = new Map(tasks.map(task => [task.title, task]));
    const visited = new Set<string>();
    const sorted: Task[] = [];

    const visit = (task: Task) => {
      if (visited.has(task.id)) return;
      visited.add(task.id);

      // Process dependencies first
      if ('dependencies' in task && Array.isArray(task.dependencies)) {
        for (const depTitle of task.dependencies) {
          const depTask = Array.from(taskMap.values()).find(t => t.title === depTitle);
          if (depTask && !visited.has(depTask.id)) {
            visit(depTask);
          }
        }
      }

      sorted.push(task);
    };

    tasks.forEach(task => {
      if (!visited.has(task.id)) {
        visit(task);
      }
    });

    return sorted;
  };

  const evaluateTaskWithAI = async (task: Task) => {
    if (!selectedProject || !selectedPlan) {
      toast.error('Please select a project and plan first');
      return;
    }

    if (!geminiKey) {
      toast.error('Please add your Gemini API key in settings');
      return;
    }

    try {
      setIsEvaluatingTask(true);
      const prompt = `As a task evaluation assistant, please evaluate this completed task:

Task Title: ${task.title}
Task Description: ${task.description}
Priority: ${task.priority}
Time Taken: ${new Date(task.completedAt!).getTime() - new Date(task.createdAt).getTime()}ms

Please provide a brief evaluation of the task completion, including:
1. Whether it was completed within a reasonable time
2. Any suggestions for future similar tasks
3. A rating out of 5 stars

Format your response in a clear, concise manner.`;

      const response = await sendChatMessage(
        [{
          id: crypto.randomUUID(),
          role: 'user' as const,
          content: prompt
        }],
        geminiKey,
        'default',
        selectedModel
      );

      // Update the task evaluation in the project's plan
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id
          ? {
              ...project,
              plans: project.plans.map(plan =>
                plan.id === selectedPlan.id
                  ? {
                      ...plan,
                      tasks: plan.tasks.map(t =>
                        t.id === task.id
                          ? { ...t, evaluation: response.content }
                          : t
                      )
                    }
                  : plan
              )
            }
          : project
      ));

      // Update the selected project and plan to reflect the changes
      setSelectedProject(prev => prev ? {
        ...prev,
        plans: prev.plans.map(plan =>
          plan.id === selectedPlan.id
            ? {
                ...plan,
                tasks: plan.tasks.map(t =>
                  t.id === task.id
                    ? { ...t, evaluation: response.content }
                    : t
                )
              }
            : plan
        )
      } : null);

      toast.success('Task evaluated successfully!');
    } catch (error) {
      console.error('Error evaluating task:', error);
      toast.error('Error evaluating task. Please try again.');
    } finally {
      setIsEvaluatingTask(false);
    }
  };

  const createPlan = () => {
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    if (!newPlanTitle.trim()) {
      toast.error('Please enter a plan title');
      return;
    }

    const newPlan: Plan = {
      id: crypto.randomUUID(),
      title: newPlanTitle,
      description: newPlanDescription,
      tasks: [],
      createdAt: new Date().toISOString()
    };

    setProjects(prev => prev.map(project => 
      project.id === selectedProject.id
        ? { ...project, plans: [...project.plans, newPlan] }
        : project
    ));
    
    // Update the selected project to reflect the new plan
    setSelectedProject(prev => prev ? {
      ...prev,
      plans: [...prev.plans, newPlan]
    } : prev);
    
    setSelectedPlan(newPlan);
    setIsCreatingPlan(false);
    setNewPlanTitle('');
    setNewPlanDescription('');
    
    toast.success('Plan created successfully!');
  };

  const deletePlan = async (projectId: string, planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      // Update projects array
      setProjects(prev => prev.map(project => 
        project.id === projectId
          ? { ...project, plans: project.plans.filter(p => p.id !== planId) }
          : project
      ));

      // Update selected project
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => ({
          ...prev!,
          plans: prev!.plans.filter(p => p.id !== planId)
        }));
      }

      // Clear selected plan if deleted
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
      }

      toast.success('Plan deleted successfully');
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Error deleting plan. Please try again.');
    }
  };

  const addTask = (planId: string) => {
    if (!selectedProject) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: 'New Task',
      description: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      status: 'pending',
      createdAt: new Date().toISOString(),
      category: 'other',
      complexity: 'medium',
      dependencies: [],
      deliverables: [],
      successCriteria: [],
      skills: []
    };

    // Update projects array
    setProjects(prev => prev.map(project => 
      project.id === selectedProject.id
        ? {
            ...project,
            plans: project.plans.map(plan =>
              plan.id === planId
                ? { ...plan, tasks: [...plan.tasks, newTask] }
                : plan
            )
          }
        : project
    ));

    // Update selected project
    setSelectedProject(prev => prev ? {
      ...prev,
      plans: prev.plans.map(plan =>
        plan.id === planId
          ? { ...plan, tasks: [...plan.tasks, newTask] }
          : plan
      )
    } : null);
  };

  const updateTask = (planId: string, taskId: string, updates: Partial<Task>) => {
    if (!selectedProject) return;

    // Update projects array
    setProjects(prev => prev.map(project => 
      project.id === selectedProject.id
        ? {
            ...project,
            plans: project.plans.map(plan =>
              plan.id === planId
                ? {
                    ...plan,
                    tasks: plan.tasks.map(task =>
                      task.id === taskId
                        ? { ...task, ...updates }
                        : task
                    )
                  }
                : plan
            )
          }
        : project
    ));

    // Update selected project
    setSelectedProject(prev => prev ? {
      ...prev,
      plans: prev.plans.map(plan =>
        plan.id === planId
          ? {
              ...plan,
              tasks: plan.tasks.map(task =>
                task.id === taskId
                  ? { ...task, ...updates }
                  : task
              )
            }
          : plan
      )
    } : null);
  };

  const deleteTask = (planId: string, taskId: string) => {
    if (!selectedProject) return;

    // Update projects array
    setProjects(prev => prev.map(project => 
      project.id === selectedProject.id
        ? {
            ...project,
            plans: project.plans.map(plan =>
              plan.id === planId
                ? { ...plan, tasks: plan.tasks.filter(task => task.id !== taskId) }
                : plan
            )
          }
        : project
    ));

    // Update selected project
    setSelectedProject(prev => prev ? {
      ...prev,
      plans: prev.plans.map(plan =>
        plan.id === planId
          ? { ...plan, tasks: plan.tasks.filter(task => task.id !== taskId) }
          : plan
      )
    } : null);
  };

  // Add function to group and filter tasks
  const getFilteredAndGroupedTasks = (tasks: Task[]) => {
    let filteredTasks = tasks.filter(task => 
      (showCompleted || task.status !== 'completed') &&
      (!selectedCategory || task.category === selectedCategory) &&
      (!searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (groupBy === 'none') return { ungrouped: filteredTasks };

    return filteredTasks.reduce((groups: Record<string, Task[]>, task) => {
      const key = groupBy === 'category' ? task.category :
                 groupBy === 'priority' ? task.priority :
                 groupBy === 'status' ? task.status :
                 'other';
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
      return groups;
    }, {});
  };

  // Add task controls rendering
  const renderControls = () => (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-navy-700/50 rounded-lg">
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        />
      </div>

      {/* Group By */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">Group by:</label>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as GroupBy)}
          className="bg-navy-900/50 border border-navy-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <option value="none">None</option>
          <option value="status">Status</option>
          <option value="priority">Priority</option>
          <option value="category">Category</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">Category:</label>
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="bg-navy-900/50 border border-navy-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <option value="">All</option>
          <option value="research">Research</option>
          <option value="planning">Planning</option>
          <option value="implementation">Implementation</option>
          <option value="review">Review</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Show Completed Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showCompleted"
          checked={showCompleted}
          onChange={(e) => setShowCompleted(e.target.checked)}
          className="rounded border-navy-600 bg-navy-700 text-primary-500 focus:ring-primary-500/50"
        />
        <label htmlFor="showCompleted" className="text-sm text-gray-400">
          Show completed
        </label>
      </div>
    </div>
  );

  // Update the task rendering section
  const renderTasks = (tasks: Task[]) => {
    const groupedTasks = getFilteredAndGroupedTasks(tasks);

    if (Object.values(groupedTasks).flat().length === 0) {
      return (
        <div className="text-center py-12">
          <ListTodo className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No tasks found</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([group, tasks]) => (
          <div key={group} className="space-y-2">
            {group !== 'ungrouped' && (
              <h3 className="text-lg font-medium text-white capitalize mb-4">
                {group}
                <span className="text-sm text-gray-400 ml-2">
                  ({tasks.length})
                </span>
              </h3>
            )}
            <div className="grid gap-2">
              {tasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`group p-4 rounded-lg border transition-all ${
                    task.status === 'completed'
                      ? 'bg-navy-800/30 border-navy-700'
                      : 'bg-navy-800 border-navy-700 hover:border-primary-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateTask(selectedPlan!.id, task.id, {
                          status: task.status === 'completed' ? 'pending' : 'completed',
                          completedAt: task.status !== 'completed' ? new Date().toISOString() : undefined
                        })}
                        className={`p-2 rounded-lg transition-colors ${
                          task.status === 'completed'
                            ? 'bg-green-500/10 text-green-400'
                            : 'text-gray-400 hover:bg-green-500/10 hover:text-green-400'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => setFullScreenTask(task)}
                        className="p-2 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-primary-500/10 transition-colors"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => deleteTask(selectedPlan!.id, task.id)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => updateTask(selectedPlan!.id, task.id, { title: e.target.value })}
                          className={`flex-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded px-2 py-1 ${
                            task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
                          }`}
                        />
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-lg text-xs ${categoryColors[task.category]}`}>
                            {task.category}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs ${complexityColors[task.complexity]}`}>
                            {task.complexity}
                          </span>
                        </div>
                      </div>

                      {task.description && (
                        <div className="mt-2">
                          <textarea
                            value={task.description}
                            onChange={(e) => updateTask(selectedPlan!.id, task.id, { description: e.target.value })}
                            placeholder="Add description..."
                            rows={2}
                            className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                          />
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        {task.completedAt && (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Add task button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addTask(selectedPlan!.id)}
          className="fixed bottom-8 right-8 p-4 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    );
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project and all its plans?')) {
      return;
    }

    try {
      // Clear selected project and plan if deleted
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setSelectedPlan(null);
      }

      // Remove from projects array
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project. Please try again.');
    }
  };

  const createProject = async () => {
    if (!newProjectTitle.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    try {
      const newProject: Project = {
        id: crypto.randomUUID(),
        title: newProjectTitle,
        description: newProjectDescription,
        createdAt: new Date().toISOString(),
        plans: []
      };

      // Create and set the project first
      setProjects(prev => [...prev, newProject]);
      setSelectedProject(newProject);

      // If user wants to create plans with the project
      if (shouldCreatePlan && initialPlanDescription.trim()) {
        setIsGeneratingPlan(true);
        try {
          // Generate multiple plans if specified
          for (let i = 0; i < numberOfPlans; i++) {
            await generatePlanWithAI(initialPlanDescription);
            // Add a delay between plan generations
            if (i < numberOfPlans - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          toast.success(`Created project with ${numberOfPlans} plan${numberOfPlans > 1 ? 's' : ''}`);
        } catch (error) {
          console.error('Error generating plans:', error);
          toast.error('Error generating some plans. The project was created but not all plans were generated.');
        } finally {
          setIsGeneratingPlan(false);
        }
      } else {
        toast.success('Project created successfully');
      }

      // Reset form state
      setIsCreatingProject(false);
      setNewProjectTitle('');
      setNewProjectDescription('');
      setInitialPlanDescription('');
      setShouldCreatePlan(false);
      setNumberOfPlans(1);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Error creating project. Please try again.');
    }
  };

  // Add project card rendering
  const renderProjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {projects.map(project => (
        <motion.div
          key={project.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`bg-navy-800/50 rounded-lg p-6 cursor-pointer border ${
            selectedProject?.id === project.id
              ? 'border-primary-500'
              : 'border-transparent hover:border-primary-500/50'
          }`}
          onClick={() => handleProjectSelect(project)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="text-gray-400 mt-1">{project.description}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(project.id);
              }}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>{project.plans.length} plans</span>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </motion.div>
      ))}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsCreatingProject(true)}
        className="bg-navy-800/50 rounded-lg p-6 border-2 border-dashed border-navy-600 hover:border-primary-500/50 cursor-pointer flex flex-col items-center justify-center text-center"
      >
        <Plus className="w-8 h-8 text-primary-400 mb-2" />
        <span className="text-gray-400">Create New Project</span>
      </motion.div>
    </div>
  );

  // Add project creation modal
  const renderProjectModal = () => (
    <AnimatePresence>
      {isCreatingProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-navy-800 rounded-lg p-6 max-w-lg w-full space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <button
                onClick={() => setIsCreatingProject(false)}
                className="p-1 rounded-lg hover:bg-navy-700"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Enter project title"
                  className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Enter project description"
                  rows={3}
                  className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>

              <div className="border-t border-navy-600 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="createPlan"
                    checked={shouldCreatePlan}
                    onChange={(e) => setShouldCreatePlan(e.target.checked)}
                    className="rounded border-navy-600 bg-navy-700 text-primary-500 focus:ring-primary-500/50"
                  />
                  <label htmlFor="createPlan" className="text-sm text-gray-400">
                    Create plans with AI
                  </label>
                </div>

                {shouldCreatePlan && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Plan Description</label>
                      <textarea
                        value={initialPlanDescription}
                        onChange={(e) => setInitialPlanDescription(e.target.value)}
                        placeholder="Describe what you want AI to plan for you"
                        rows={3}
                        className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">AI Model</label>
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value as ModelId)}
                          className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                        >
                          {Object.entries(AVAILABLE_MODELS).map(([id, model]) => (
                            <option key={id} value={id}>
                              {model.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Number of Plans</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={numberOfPlans}
                          onChange={(e) => setNumberOfPlans(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-24 bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setIsCreatingProject(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newProjectTitle.trim() || (shouldCreatePlan && !initialPlanDescription.trim())}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {shouldCreatePlan && isGeneratingPlan ? (
                  <>
                    <Settings className="w-4 h-4 animate-spin" />
                    Generating Plans...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {shouldCreatePlan ? 'Create Project & Generate Plans' : 'Create Project'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Update the plan creation modal to include model selection
  const renderPlanModal = () => (
    <AnimatePresence>
      {isCreatingPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsCreatingPlan(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-navy-800 rounded-lg p-6 max-w-lg w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create New Plan</h2>
              <button
                onClick={() => setIsCreatingPlan(false)}
                className="p-1 rounded-lg hover:bg-navy-700"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Plan Title</label>
                <input
                  type="text"
                  value={newPlanTitle}
                  onChange={(e) => setNewPlanTitle(e.target.value)}
                  placeholder="Enter plan title"
                  className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                  placeholder="Enter plan description or what you want AI to plan for you"
                  rows={3}
                  className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelId)}
                  className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  {Object.entries(AVAILABLE_MODELS).map(([id, model]) => (
                    <option key={id} value={id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setIsCreatingPlan(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => generatePlanWithAI(newPlanDescription)}
                disabled={!newPlanDescription.trim() || isGeneratingPlan}
                className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Settings className={`w-4 h-4 ${isGeneratingPlan ? 'animate-spin' : ''}`} />
                {isGeneratingPlan ? 'Generating...' : 'Generate with AI'}
              </button>
              <button
                onClick={createPlan}
                disabled={!newPlanTitle.trim()}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Plan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Update the selected project when switching projects
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setSelectedPlan(null); // Reset selected plan when switching projects
  };

  // Add full-screen task modal component
  const renderFullScreenTask = () => (
    <AnimatePresence>
      {fullScreenTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setFullScreenTask(null)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-navy-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6 sticky top-0 bg-navy-800 pb-4 border-b border-navy-600">
              <div className="flex-1">
                <input
                  type="text"
                  value={fullScreenTask.title}
                  onChange={(e) => updateTask(selectedPlan!.id, fullScreenTask.id, { title: e.target.value })}
                  className="text-2xl font-bold bg-transparent text-white w-full focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded px-2 py-1"
                  placeholder="Task Title"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-3 py-1.5 rounded-lg text-sm ${categoryColors[fullScreenTask.category]}`}>
                    {fullScreenTask.category}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-sm ${priorityColors[fullScreenTask.priority]}`}>
                    {fullScreenTask.priority}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-sm ${complexityColors[fullScreenTask.complexity]}`}>
                    {fullScreenTask.complexity}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-sm ${statusColors[fullScreenTask.status]}`}>
                    {fullScreenTask.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setFullScreenTask(null)}
                className="p-2 hover:bg-navy-700 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Description</label>
                <textarea
                  value={fullScreenTask.description}
                  onChange={(e) => updateTask(selectedPlan!.id, fullScreenTask.id, { description: e.target.value })}
                  placeholder="Add a detailed description..."
                  rows={6}
                  className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-vertical"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Due Date</label>
                  <input
                    type="datetime-local"
                    value={new Date(fullScreenTask.dueDate).toISOString().slice(0, 16)}
                    onChange={(e) => updateTask(selectedPlan!.id, fullScreenTask.id, { dueDate: new Date(e.target.value).toISOString() })}
                    className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
                {fullScreenTask.completedAt && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Completed Date</label>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{new Date(fullScreenTask.completedAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Task Properties */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Category</label>
                  <select
                    value={fullScreenTask.category}
                    onChange={(e) => updateTask(selectedPlan!.id, fullScreenTask.id, { category: e.target.value as Task['category'] })}
                    className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <option value="research">Research</option>
                    <option value="planning">Planning</option>
                    <option value="implementation">Implementation</option>
                    <option value="review">Review</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Priority</label>
                  <select
                    value={fullScreenTask.priority}
                    onChange={(e) => updateTask(selectedPlan!.id, fullScreenTask.id, { priority: e.target.value as Task['priority'] })}
                    className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Complexity</label>
                  <select
                    value={fullScreenTask.complexity}
                    onChange={(e) => updateTask(selectedPlan!.id, fullScreenTask.id, { complexity: e.target.value as Task['complexity'] })}
                    className="w-full bg-navy-900/50 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-navy-600">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      updateTask(selectedPlan!.id, fullScreenTask.id, {
                        status: fullScreenTask.status === 'completed' ? 'pending' : 'completed',
                        completedAt: fullScreenTask.status !== 'completed' ? new Date().toISOString() : undefined
                      });
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      fullScreenTask.status === 'completed'
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-navy-700 text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{fullScreenTask.status === 'completed' ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                  {fullScreenTask.status === 'completed' && (
                    <button
                      onClick={() => evaluateTaskWithAI(fullScreenTask)}
                      disabled={isEvaluatingTask}
                      className="px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Star className="w-5 h-5" />
                      <span>{isEvaluatingTask ? 'Evaluating...' : 'Get AI Evaluation'}</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    deleteTask(selectedPlan!.id, fullScreenTask.id);
                    setFullScreenTask(null);
                  }}
                  className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Task</span>
                </button>
              </div>

              {/* AI Evaluation */}
              {fullScreenTask.evaluation && (
                <div className="mt-6 p-4 bg-primary-500/5 rounded-lg border border-primary-500/10">
                  <div className="flex items-center gap-2 text-primary-400 mb-3">
                    <Star className="w-5 h-5" />
                    <h3 className="font-medium">AI Evaluation</h3>
                  </div>
                  <ReactMarkdown className="prose prose-invert max-w-none text-gray-300">
                    {fullScreenTask.evaluation}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Todo Planner
          </h1>
          <p className="text-gray-400">
            Create and manage your tasks with AI-powered planning and evaluation
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setNewPlanTitle('');
            setNewPlanDescription('');
            setIsCreatingPlan(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg cursor-pointer hover:bg-primary-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map(project => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-navy-800/50 rounded-lg p-6 cursor-pointer border ${
              selectedProject?.id === project.id
                ? 'border-primary-500'
                : 'border-transparent hover:border-primary-500/50'
            }`}
            onClick={() => handleProjectSelect(project)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-400 mt-1">{project.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
              <span>{project.plans.length} plans</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreatingProject(true)}
          className="bg-navy-800/50 rounded-lg p-6 border-2 border-dashed border-navy-600 hover:border-primary-500/50 cursor-pointer flex flex-col items-center justify-center text-center"
        >
          <Plus className="w-8 h-8 text-primary-400 mb-2" />
          <span className="text-gray-400">Create New Project</span>
        </motion.div>
      </div>

      {/* Selected Project Content */}
      {selectedProject && (
        <div className="grid grid-cols-12 gap-6">
          {/* Plans List */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-navy-800/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Project Plans</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setNewPlanTitle('');
                    setNewPlanDescription('');
                    setIsCreatingPlan(true);
                  }}
                  className="flex items-center gap-2 p-2 text-primary-400 rounded-lg hover:bg-primary-500/10"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="space-y-2">
                {selectedProject.plans.map(plan => (
                  <motion.button
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedPlan?.id === plan.id
                        ? 'bg-primary-500/10 border-primary-500/20 text-primary-400'
                        : 'bg-navy-700/50 border-navy-600 text-gray-300 hover:bg-navy-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <ListTodo className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate block">{plan.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs text-gray-500">
                        {plan.tasks.filter(t => t.status === 'completed').length}/{plan.tasks.length}
                      </span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlan(selectedProject.id, plan.id);
                        }}
                        className="p-1 rounded-md hover:bg-red-500/10 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Plan Content */}
          <div className="col-span-12 lg:col-span-9">
            {selectedPlan ? (
              <div className="bg-navy-800/50 rounded-lg p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={selectedPlan.title}
                      onChange={(e) => {
                        setProjects(prev => prev.map(project => 
                          project.id === selectedProject.id
                            ? { 
                                ...project, 
                                plans: project.plans.map(plan => 
                                  plan.id === selectedPlan.id
                                    ? { ...plan, title: e.target.value }
                                    : plan
                                )
                              }
                            : project
                        ));
                        // Update selected project
                        setSelectedProject(prev => prev ? {
                          ...prev,
                          plans: prev.plans.map(plan =>
                            plan.id === selectedPlan.id
                              ? { ...plan, title: e.target.value }
                              : plan
                          )
                        } : null);
                      }}
                      className="text-2xl font-bold bg-transparent text-white w-full focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg px-3 py-1"
                      placeholder="Plan Title"
                    />
                    <textarea
                      value={selectedPlan.description}
                      onChange={(e) => {
                        setProjects(prev => prev.map(project => 
                          project.id === selectedProject.id
                            ? { 
                                ...project, 
                                plans: project.plans.map(plan => 
                                  plan.id === selectedPlan.id
                                    ? { ...plan, description: e.target.value }
                                    : plan
                                )
                              }
                            : project
                        ));
                        // Update selected project
                        setSelectedProject(prev => prev ? {
                          ...prev,
                          plans: prev.plans.map(plan =>
                            plan.id === selectedPlan.id
                              ? { ...plan, description: e.target.value }
                              : plan
                          )
                        } : null);
                      }}
                      placeholder="Add plan description..."
                      className="mt-2 w-full bg-navy-700/50 text-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={() => addTask(selectedPlan.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors ml-4"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </div>

                {/* AI Schedule and Suggestions */}
                {(selectedPlan.schedule || selectedPlan.aiSuggestions) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-navy-700/50 rounded-lg">
                    {selectedPlan.schedule && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary-400">
                          <Calendar className="w-4 h-4" />
                          <h3 className="font-medium">Suggested Schedule</h3>
                        </div>
                        <ReactMarkdown className="text-sm text-gray-300 prose prose-invert max-w-none">
                          {selectedPlan.schedule}
                        </ReactMarkdown>
                      </div>
                    )}
                    {selectedPlan.aiSuggestions && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary-400">
                          <MessageSquare className="w-4 h-4" />
                          <h3 className="font-medium">AI Suggestions</h3>
                        </div>
                        <ReactMarkdown className="text-sm text-gray-300 prose prose-invert max-w-none">
                          {selectedPlan.aiSuggestions}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}

                {/* Task Controls and List */}
                {renderControls()}
                {renderTasks(selectedPlan.tasks)}
              </div>
            ) : (
              <div className="bg-navy-800/50 rounded-lg p-6 text-center">
                <ListTodo className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Select a plan or create a new one to get started</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {renderProjectModal()}
      {renderPlanModal()}
      {renderFullScreenTask()}
    </div>
  );
} 