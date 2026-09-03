export const SEED_BOOKS = [
  {
    id: 'refactor-repeat',
    no: '005.1 VOS',
    title: 'Refactor & Repeat',
    author: 'M. Voss',
    price: 499,
    originalPrice: 799,
    color: '#4F46E5',
    colorEnd: '#3730A3',
    tags: ['refactoring', 'legacy code', 'clean code'],
    category: 'Software Engineering',
    stock: 24,
    featured: true,
    bestSeller: true,
    rating: 4.8,
    reviewCount: 38,
    desc: 'A field guide to untangling legacy systems one small, safe commit at a time.',
    fullDesc: `Refactor & Repeat delivers pragmatic strategies for modernizing legacy codebases without screeching feature development to a halt.

Learn how to create characterization tests that protect existing behavior, identify the highest-leverage seams in monolithic architectures, and establish continuous refactoring loops that pay down technical debt systematically.

Whether you are inheriting a decade-old code base or preventing your latest microservice from rotting, this book offers actionable patterns tested in enterprise production environments.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: The Anatomy of Technical Debt',
        content: `Legacy code is simply code without automated safety nets. In this opening chapter, we dissect why code degrades over time and why rewrites almost always fail.\n\nKey Takeaways:\n1. The Lehman Laws of Software Evolution.\n2. Pinpointing coupling points before touching a line of logic.\n3. The Golden Master technique for zero-regression refactoring.\n\n"Never rewrite what you can systematically isolate and transform."`
      },
      {
        title: 'Chapter 2: The Characterization Testing Pattern',
        content: `Before changing any behavior, we must document existing quirks. Characterization tests capture what the software actually does—not what someone hoped it would do ten years ago.\n\nWe explore step-by-step harnesses for capturing I/O streams and freezing API responses into deterministic snapshots.`
      },
      {
        title: 'Chapter 3: Safe Extraction Patterns',
        content: `Breaking monolithic routines into pure, composable subroutines. How to extract domain services without breaking dependency graphs or introducing circular dependencies.`
      }
    ]
  },
  {
    id: 'concurrency-notebook',
    no: '005.1 KHA',
    title: 'The Concurrency Notebook',
    author: 'R. Khatri',
    price: 599,
    originalPrice: 899,
    color: '#0284C7',
    colorEnd: '#0369A1',
    tags: ['async', 'threads', 'concurrency'],
    category: 'Systems & Architecture',
    stock: 18,
    featured: true,
    bestSeller: false,
    rating: 4.9,
    reviewCount: 42,
    desc: 'Notes on races, deadlocks, and the mental models that keep concurrent code sane.',
    fullDesc: `Concurrency is notorious for subtle bugs that only manifest at 3 AM under production load. The Concurrency Notebook bridges the gap between theoretical thread models and real-world high-throughput services.

Through clear diagrams and reproducible code examples, you will master lock-free data structures, actor models, reactive event loops, structured concurrency, and atomic memory operations.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: The Race Condition Illustrated',
        content: `Understanding how the CPU cache hierarchies, memory barriers, and compiler instruction reordering create the illusion of non-deterministic bugs.\n\nWe explore volatile semantics, memory fences, and how modern runtimes manage synchronization primitives.`
      },
      {
        title: 'Chapter 2: Structured Concurrency',
        content: `Moving away from fire-and-forget background threads to deterministic tree lifetimes where parent tasks await all child coroutines before completing.`
      }
    ]
  },
  {
    id: 'systems-below-fold',
    no: '004.6 OYE',
    title: 'Systems Below the Fold',
    author: 'D. Oyelaran',
    price: 699,
    originalPrice: 999,
    color: '#059669',
    colorEnd: '#047857',
    tags: ['distributed systems', 'networking', 'backend'],
    category: 'Distributed Systems',
    stock: 12,
    featured: true,
    bestSeller: false,
    rating: 4.7,
    reviewCount: 29,
    desc: 'What actually happens between the request and response across distributed nodes.',
    fullDesc: `Behind every modern web application lies a tangled web of distributed nodes, consensus protocols, TCP handshakes, load balancing heuristics, and replication lag.

Systems Below the Fold takes you on a deep dive into the infrastructure that keeps massive cloud applications alive. Understand consensus protocols (Raft, Paxos), partitioned networks, idempotency keys, and zero-downtime database migrations.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: The Network is Not Reliable',
        content: `Fallacies of distributed computing revisited for cloud-native architectures. Packet drops, tail latency amplification, and circuit breakers in action.`
      },
      {
        title: 'Chapter 2: Distributed Consensus Simplified',
        content: `How Raft and Paxos ensure state machine replication across unreliable hardware without single points of failure.`
      }
    ]
  },
  {
    id: 'typed-true',
    no: '005.1 FEN',
    title: 'Typed & True',
    author: 'S. Fenwick',
    price: 449,
    originalPrice: 649,
    color: '#7C3AED',
    colorEnd: '#5B21B6',
    tags: ['typescript', 'types', 'design patterns'],
    category: 'Programming Languages',
    stock: 31,
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviewCount: 51,
    desc: 'Using a type system as a design tool, not just a linter with opinions.',
    fullDesc: `Static types are often viewed as safety rails or bureaucratic checklists. Typed & True reframes type systems as interactive modeling tools that make illegal program states unrepresentable.

Learn advanced type-level programming, conditional types, template literal types, branded types, and parser-combinator validation patterns in TypeScript.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: Making Illegal States Unrepresentable',
        content: `Why union types beat boolean flag spaghetti. How to structure domain models where the compiler physically prevents conflicting states.`
      },
      {
        title: 'Chapter 2: Type-Level Computation',
        content: `Harnessing conditional types, mapped types, and recursion to build type-safe SQL query builders and validation pipelines.`
      }
    ]
  },
  {
    id: 'query-craft',
    no: '005.7 NAS',
    title: 'Query Craft',
    author: 'I. Nasser',
    price: 549,
    originalPrice: 799,
    color: '#D97706',
    colorEnd: '#B45309',
    tags: ['sql', 'databases', 'performance'],
    category: 'Databases',
    stock: 19,
    featured: false,
    bestSeller: true,
    rating: 4.8,
    reviewCount: 34,
    desc: 'Schema design and query patterns that hold up once real users show up.',
    fullDesc: `Designing a database schema for 1,000 rows is trivial. Scaling it to 100 million rows while keeping p99 response times under 20ms requires craftsmanship.

Query Craft covers indexing fundamentals (B-Trees, GiST, BRIN), query planner execution trees, partitioning strategies, connection pooling, and multi-tenant isolation.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: Inside the Query Planner',
        content: `Decoding EXPLAIN ANALYZE output: Seq Scan vs Index Scan vs Bitmap Heap Scan. Why missing stats cause disastrous execution plans.`
      }
    ]
  },
  {
    id: 'container-almanac',
    no: '004.2 PRK',
    title: 'The Container Almanac',
    author: 'L. Park',
    price: 579,
    originalPrice: 849,
    color: '#DB2777',
    colorEnd: '#9D174D',
    tags: ['docker', 'kubernetes', 'devops'],
    category: 'DevOps & Cloud',
    stock: 15,
    featured: false,
    bestSeller: false,
    rating: 4.6,
    reviewCount: 22,
    desc: 'A season-by-season guide to running containers without losing weekends.',
    fullDesc: `Containers changed deployment forever, but they also introduced layers of orchestration complexity.

The Container Almanac is your guide to building ultra-slim multi-stage images, configuring rootless containers, tuning Linux cgroups v2, orchestrating Kubernetes pods, and diagnosing OOM-kills.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: Micro-Images & Multi-Stage Builds',
        content: `Shrinking 1.2GB bloated images to 15MB hardened scratch containers with zero root vulnerabilities.`
      }
    ]
  },
  {
    id: 'clean-terminal',
    no: '004.2 ABE',
    title: 'Clean Terminal',
    author: 'T. Abernathy',
    price: 399,
    originalPrice: 599,
    color: '#EA580C',
    colorEnd: '#C2410C',
    tags: ['cli', 'shell', 'developer tools'],
    category: 'Developer Productivity',
    stock: 28,
    featured: false,
    bestSeller: false,
    rating: 4.7,
    reviewCount: 31,
    desc: 'Small, composable shell habits for people who live in the terminal.',
    fullDesc: `Your command-line shell is your developer operating cockpit. Clean Terminal teaches you how to master streams, pipes, jq data wrangling, fzf fuzzy search, zoxide navigation, and automated dotfiles management.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: The Unix Philosophy in Practice',
        content: `Composable streams, exit status semantics, and processing gigabytes of log data with awk, sed, and ripgrep.`
      }
    ]
  },
  {
    id: 'algorithms-scale',
    no: '005.1 CHU',
    title: 'Algorithms at Scale',
    author: 'W. Chu',
    price: 749,
    originalPrice: 1199,
    color: '#0D9488',
    colorEnd: '#0F766E',
    tags: ['algorithms', 'performance', 'data structures'],
    category: 'Computer Science',
    stock: 9,
    featured: false,
    bestSeller: false,
    rating: 4.9,
    reviewCount: 47,
    desc: 'What changes about your favorite algorithms once N stops being small.',
    fullDesc: `Textbook Big-O complexity assumes infinite RAM and zero cache misses. In modern hardware, memory bandwidth and branch prediction dominate runtime performance.

Algorithms at Scale explores cache-oblivious algorithms, probabilistic data structures (Bloom Filters, HyperLogLog, Count-Min Sketch), SIMD vectorization, and external memory sorting.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: Hardware-Conscious Data Structures',
        content: `Why array-backed structures destroy pointer-chasing linked lists due to CPU L1/L2 cache prefetching.`
      }
    ]
  },
  {
    id: 'api-field-guide',
    no: '005.3 MOR',
    title: 'The API Field Guide',
    author: 'C. Moreau',
    price: 479,
    originalPrice: 699,
    color: '#9333EA',
    colorEnd: '#6B21A8',
    tags: ['rest', 'graphql', 'api design'],
    category: 'Software Engineering',
    stock: 22,
    featured: false,
    bestSeller: false,
    rating: 4.8,
    reviewCount: 39,
    desc: 'Designing interfaces that are still pleasant to use two years and four teams later.',
    fullDesc: `Building an API is easy; evolving it without breaking millions of client devices is an art.

The API Field Guide covers URI conventions, error payload standardization (RFC 7807), pagination patterns (cursor vs offset), rate limiting algorithms (Token Bucket, Leaky Bucket), idempotency keys, and OpenAPI 3.1 documentation.`,
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sampleChapters: [
      {
        title: 'Chapter 1: The Contract First Philosophy',
        content: `Defining your API contract using OpenAPI specifications before writing backend implementation routes.`
      }
    ]
  }
];

export const MEMBERSHIP_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    numericPrice: 0,
    sub: 'forever',
    badge: 'Standard',
    features: ['Browse complete digital catalog', 'Personal wishlist', 'Basic book recommendations', 'Book reviews & community ratings', 'Access to free sample chapters'],
    discountPercent: 0
  },
  {
    id: 'reader',
    name: 'Reader',
    price: '₹149',
    numericPrice: 149,
    sub: '/month',
    badge: 'Popular',
    features: ['5% discount on all book purchases', 'Price-drop email & push alerts', 'Personalized AI discovery', 'Early access to new book releases', 'Unlimited online reading time'],
    discountPercent: 5
  },
  {
    id: 'pro',
    name: 'Pro Reader',
    price: '₹299',
    numericPrice: 299,
    sub: '/month',
    featured: true,
    badge: 'BEST VALUE',
    features: ['12% discount on all store purchases', 'Exclusive bundle deals', 'Advanced algorithmic recommendation engine', 'Interactive reading goals & tracking', 'Offline PDF export access', 'Priority support line'],
    discountPercent: 12
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹499',
    numericPrice: 499,
    sub: '/month',
    badge: 'Elite',
    features: ['20% discount on all purchases', 'Unlimited access to Pro digital shelf', 'Direct author Q&A sessions', 'VIP early releases & beta chapters', 'Priority 24/7 dedicated support', 'Family library sharing (up to 3 users)'],
    discountPercent: 20
  }
];
