// MongoDB initialization script
// Creates database, user, and seeds sample data

db = db.getSiblingDB('taskflow');

db.createUser({
  user: 'taskflow_user',
  pwd: 'taskflow_pass',
  roles: [{ role: 'readWrite', db: 'taskflow' }]
});

db.tasks.insertMany([
  {
    title: "Setup CI/CD Pipeline",
    description: "Configure GitHub Actions for automated build and deploy",
    status: "in-progress",
    priority: "high",
    dueDate: new Date("2025-07-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Write Unit Tests",
    description: "Add Jest tests for all API endpoints",
    status: "todo",
    priority: "medium",
    dueDate: new Date("2025-07-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Dockerize Application",
    description: "Create Dockerfiles for frontend, backend, and compose file",
    status: "done",
    priority: "high",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ TaskFlow database initialized with sample data");
