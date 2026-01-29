# 🤝 Contributing to Job Recruitment System

First off, thank you for considering contributing to our project! It's people like you that make this system such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**

### Suggesting Enhancements ✨

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the TypeScript/JavaScript styleguides
* Include appropriate test cases
* Update documentation as needed
* End all files with a newline

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Example:
```
Add job search filtering functionality

- Implement search by title
- Add filter by department
- Add filter by location
- Update JobGrid component
```

### TypeScript/JavaScript Styleguide

* Use TypeScript for new files
* Define interfaces/types for all data structures
* Use meaningful variable names
* Add JSDoc comments for complex functions
* Use `const` by default, `let` when needed
* Avoid `var` declarations
* Use template literals for string concatenation

```typescript
/**
 * Fetches a user by ID
 * @param id - The user ID
 * @returns The user object or null
 */
async function getUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  return user;
}
```

### React Component Styleguide

* Use functional components with hooks
* Place component logic in custom hooks when possible
* Keep components focused and single-responsibility
* Use TypeScript for prop types
* Add PropTypes as fallback (if needed)

```typescript
interface JobCardProps {
  job: Job;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function JobCard({ job, onDelete, onEdit }: JobCardProps) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.description}</p>
    </div>
  );
}
```

### Prisma Schema Styleguide

* Add meaningful comments for complex models
* Use descriptive field names
* Add `@map()` for database columns if needed
* Include timestamps (createdAt, updatedAt) when relevant
* Define relationships clearly with `@relation()`

```prisma
/// User model for authentication and profiles
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique  /// Must be unique for login
  password  String   /// Hashed with bcrypt
  
  /// Relations
  jobs      Job[]    /// Jobs created by this user
  
  @@map("users")
}
```

## Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/job-recruitment-system.git
   cd job-recruitment-system/website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Initialize database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## Testing

Before submitting a pull request, please test your changes:

```bash
# Lint code
npm run lint

# Run tests (when available)
npm test

# Build for production
npm run build
```

## Database Migrations

When modifying the Prisma schema:

1. **Update `prisma/schema.prisma`**
2. **Create a migration**
   ```bash
   npm run db:migrate
   ```
3. **Test the migration**
   ```bash
   npm run db:reset
   ```
4. **Commit both schema and migration files**

## Creating a New Feature

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Add component files
   - Update API routes if needed
   - Update database schema if needed
   - Update tests
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Use a clear title
   - Reference any related issues
   - Describe the changes made
   - Include screenshots if UI changes

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the CHANGELOG.md with notes on your changes
3. The PR title should be clear and descriptive
4. Wait for review and address feedback
5. Once approved, your PR will be merged

## Directory Structure for New Features

```
Add new feature in this structure:

src/
├── app/
│   └── [feature]/
│       └── page.tsx                    # Feature page
├── components/
│   └── [feature]/                      # Feature components
│       ├── ComponentName.tsx
│       └── types.ts                    # Component types
├── lib/
│   └── [feature].ts                    # Feature utilities (if needed)
└── actions/
    └── [feature]Actions.ts             # Feature server actions

prisma/
└── schema.prisma                       # Update if database changes
```

## Additional Notes

### Performance Considerations

* Minimize database queries
* Use Prisma select to fetch only needed fields
* Implement pagination for large lists
* Cache where appropriate
* Optimize images

### Accessibility

* Ensure keyboard navigation works
* Add ARIA labels where needed
* Use semantic HTML
* Test with screen readers
* Maintain color contrast

### Security

* Never commit secrets or credentials
* Validate user input on both client and server
* Use parameterized queries (Prisma does this)
* Follow OWASP guidelines
* Keep dependencies updated

## Questions?

Feel free to open an issue for questions or discussions. We're here to help!

## Recognition

Contributors will be recognized in the CHANGELOG.md and acknowledged for their contributions.

---

**Thank you for contributing!** 🎉
