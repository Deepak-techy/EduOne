# Git & GitHub Collaboration Guide

This document provides a quick reference for using **Git** and **GitHub** while working on team projects.  
It covers essential commands for both **local** and **remote** operations.

---

## 1. Initial Setup

### Check you configuration
```
git config --global --list
```
If username and email are not set then, do the following:

### Configure Git (one-time)
```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

### Clone the repository
```
git clone <repo_url>
cd <repo_name>
```

---

## 2. Checking Branches

### Show local branches:
```
git branch
```

### Show all branches (local + remote):
```
git branch -a
```

---

## 3. Working with Branches

### Create a new branch (local)
```
git switch -c branch-name
```

### Switch to an existing branch
```
git checkout branch-name    // returns an error if branch doesn't exist (recommended)

# or

git switch branch-name
```

### Delete a local branch
```
git branch -d branch-name      # safe delete (refuses if unmerged)
git branch -D branch-name      # force delete
```

### Delete a remote branch (on GitHub)
```
git push origin --delete branch-name
git fetch --prune   # clean up old remote references
```

### Both:
```
git branch -d branch-name
git push origin --delete branch-name
git fetch --prune
```

---

## 4. Local Workflow

### Check file status
```
git status
```

### Add files to staging
```
git add <filename>
git add .     # add all changes
```

### Commit changes
```
git commit -m "Meaningful commit message"
```

---

## 5. Remote Workflow

### Link local branch to remote (first push)
```
git push -u origin branch-name
```

### Push changes (subsequent pushes)
```
git push
```

### Fetch remote changes (update knowledge of remote branches)
```
git fetch
```

### Pull remote changes (fetch + merge into current branch)
```
git pull
```

---

## 6. Collaboration Workflow (Recommended)

### Always pull latest changes before starting work:
```
git checkout main
git pull origin main
```

### Create a feature branch from main:
```
git switch -c feature-xyz
```

### Work on your branch, commit, and push:
```
git add .
git commit -m "Added feature xyz"
git push -u origin feature-xyz
```

### Open a Pull Request (PR) on GitHub for review/merge.

---

## 7. Upstream & Tracking

 When you push with **-u**, it sets an upstream branch, so next time you can simply use **git push** or **git pull** without extra arguments.

### Example:
 ```
 git push -u origin feature-xyz
```

### Now:
```
git push     # works (linked to origin/feature-xyz)
git pull     # works (fetch + merge from origin/feature-xyz)
```

---

## 8. Useful Commands

### See commit history (one line per commit):
```
git log --oneline
```

### Undo last commit (keep changes):
```
git reset --soft HEAD~1
```

### Discard local changes to a file:
```
git checkout -- filename
```

### Stash temporary work:
```
git stash
git stash apply    # bring it back
git stash clear    # clear the stash after bringing it back
```

---

