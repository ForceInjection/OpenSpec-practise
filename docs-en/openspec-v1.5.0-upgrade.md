# From Hardcoded to Dynamic Instructions: The Three Major Changes in OpenSpec v1.5.0

OpenSpec ([Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)) accumulated 600+ commits between v1.3.1 and v1.5.0. If you're still on v1.3.1, the most immediate impression after upgrading will be: **the AI understands your project better**. Behind this are three fundamental architectural changes.

## 1. Background: What v1.3.1 Looked Like

Before understanding the changes, let's revisit how things worked in the v1.3.1 era.

A typical OpenSpec workflow: type `/opsx:propose "build some feature"` in the conversation, the AI generates proposal.md, design.md, specs/, and tasks.md under `openspec/changes/`, then `/opsx:apply` implements the tasks one by one, and finally `/opsx:archive` archives the change.

This flow works, but it has three pain points:

**Instructions are hardcoded.** The prompt telling the AI "how to write a proposal" lives in TypeScript source code. If your project needs a custom template (e.g., a mandatory "rollback plan" section), you either wait for an official release or repeatedly remind the AI in conversation — and the AI often forgets.

**Phases are locked.** The proposal must finish before implementation, implementation before archiving. If you discover mid-way that design.md needs adjustment, you must interrupt the flow, manually edit the document, and re-trigger apply. The AI doesn't proactively sense these changes.

**Planning belongs to one repository.** `openspec/` sits in the project root, naturally assuming one repo per plan. When a feature spans an API service, a frontend, and a shared library, no single repo is the right home for the plan.

The three core changes in v1.5.0 correspond exactly to these three pain points.

## 2. Change One: Schema-Driven — Letting AI Dynamically Sense the Project

v1.5.0 extracted instructions from code into `schemas/spec-driven/schema.yaml`. This file declares artifact types (proposal, specs, design, tasks), their dependencies, and generation instructions for each artifact.

```text
v1.3.1:  AI receives a hardcoded prompt → generates documents
v1.5.0:  AI runs openspec instructions <artifact> --json
         → pulls the current project's context + template + rules
         → generates documents based on the latest information
```

When the AI executes `/opsx:propose`, it no longer receives static text; instead it first runs `openspec instructions proposal --json`. The JSON returned includes:

- `context`: project background from `openspec/config.yaml` (tech stack, architectural constraints)
- `rules`: rules defined per artifact type (e.g., "proposal must include SLO metrics")
- `template`: the document structure defined by the current schema
- `dependencies`: the list of completed artifacts

**Key change: you edit the rules in config.yaml, and the next `/opsx:propose` takes effect immediately — no IDE restart, no waiting for a new version.**

A natural consequence of Schema-driven is **Fluid Workflow** — since the AI queries current state every time, phase locking loses its meaning. You can go back mid-Apply to revise design.md; the next `/opsx:apply` will automatically sense the change. A batch of extended commands was added for this:

| Command              | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| `/opsx:new`          | Initialize directory structure only, create documents step by step |
| `/opsx:continue`     | Create the next artifact in dependency order                       |
| `/opsx:ff`           | Skip documents and go straight to implementation                   |
| `/opsx:sync`         | Sync delta specs to main specs without archiving                   |
| `/opsx:verify`       | Verify implementation matches the spec                             |
| `/opsx:bulk-archive` | Archive multiple changes at once                                   |
| `/opsx:onboard`      | 15-minute interactive full-flow guide                              |

## 3. Change Two: Stores — Planning Becomes an Independent Git Repository

Now that Schema solved "how the AI understands the project", the next question is "where should the plan live".

v1.5.0 introduces the **Stores** concept. A store is an ordinary Git repository containing an `openspec/` directory and a `.openspec-store/store.yaml` identity file. It does exactly one thing: **holds the plan**. Team code repositories point to it via `--store <id>` or a pointer in config.yaml.

```bash
# Create a store named team-plans
openspec store setup team-plans --path ~/openspec/team-plans

# From now on, any command can target it
openspec new change add-login --store team-plans
openspec status --change add-login --store team-plans
```

Other team members:

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A code repository only needs one line in config.yaml:

```yaml
store: team-plans
```

After that, any `openspec` command run inside the repository automatically targets the `team-plans` store — no need to pass `--store` every time.

Stores are a Beta feature with known limitations: one local checkout per store id, and OpenSpec never syncs automatically (you run git pull yourself). But this is deliberate — the store's version control is entirely Git's responsibility; OpenSpec doesn't intervene.

> v1.4.0 introduced workspace/initiative as an attempt at cross-repository planning, which v1.5.0 completely replaced with stores. If you used workspace during v1.4.0, migrate to stores; if you upgrade directly from v1.3.1, stores are a brand-new feature with no migration needed.

## 4. Change Three: Explore First — Think It Through Before Acting

The first two changes address "how", the third addresses "what".

The standard entry point in v1.3.1 was `/opsx:propose`. The user describes a requirement, and the AI generates documents directly. The problem: **the AI's "understanding" often deviates from the user's "intent"**, and the deviation only surfaces once code is written.

v1.5.0 promoted `/opsx:explore` from an experimental feature to the **recommended starting point**. Explore mode creates no files; the AI first investigates the codebase, compares options, and sketches architecture — like a zero-cost brainstorming session. Once key decisions are confirmed, it moves to `/opsx:propose`.

```text
v1.3.1:  propose → apply → archive
             ↑ deviation risk surfaces late

v1.5.0:  explore → propose → apply → sync → archive
           ↑                          ↑
      zero-cost intent validation   ensure spec sync before archiving
```

This philosophy runs through v1.5.0's documentation design — the official docs homepage's first guidance line is "Not sure what to build yet? Start with `/opsx:explore`".

## 5. Supporting Upgrades

Beyond the three major changes, v1.5.0 brings a batch of infrastructure enhancements:

**AI tool ecosystem.** New adapters for Claude Code, Mistral Vibe, Oh My Pi, Trae, etc., supporting 25+ AI coding assistants. Each adapter implements the unified `CommandContent` interface — adding a tool requires just one file.

**Global installation.** `openspec init` supports global directories, so teams can share one AI instruction configuration without re-initializing per project.

**Configuration enhancements.** Container fields in config.yaml support JSON format. The Validator's SHALL/MUST detection is more accurate, and header parsing is now case-insensitive.

**Official documentation.** A comprehensive overhaul — from "feature list" style to "scenario-guided" style: explore-first, organized by operation, emphasizing discoverability.

## 6. Trade-offs and Upgrading

**Stores are Beta.** Command names, flags, file formats, and JSON output may change in future releases. What's explicitly not done: automatic clone/pull/push (Git handles it), and multiple checkouts per store id.

**Upgrading itself is simple:**

```bash
npm install -g @fission-ai/openspec@latest
cd your-project
openspec update
```

`openspec update` refreshes all AI tool configuration files — no need to re-run `init`.

From v1.3.1 to v1.5.0, OpenSpec's core change is not feature stacking but an architectural rethinking: **instructions went from code to data, planning went from an attachment to an independent entity, and the workflow went from push to pull**. For users, the most direct experience is — the AI finally stopped "guessing".

---

_Based on analysis of [OpenSpec](https://github.com/Fission-AI/OpenSpec) diffs and changelogs from v1.3.1 to v1.5.0. Practice validation: [OpenSpec Practise v1.5.0](https://github.com/ForceInjection/OpenSpec-practise/releases/tag/v1.5.0)._
