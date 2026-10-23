# INTERVIEW-PREP.md — MERN Stack + Generative AI Trainer

**Purpose:** Complete interview preparation for a *MERN Stack Trainer + Generative AI Trainer* role
teaching undergraduate (BCA) students.

**Source:** the 49-page shared ChatGPT conversation "MERN GenAI Interview Questions" supplied with
this project, transcribed and reorganised here. It contains **153 questions with model answers**.

> **A note on trust.** This pack was written by a language model. Some answers are excellent
> teaching material; a few are opinionated or slightly off (the PDF itself ends with "ChatGPT is AI
> and can make mistakes"). Treat every answer as a **draft to verify and personalise**, not as
> scripture. In an interview, an answer you understand and can extend beats a memorised answer you
> cannot defend. See [Part 16](#part-16--how-to-use-this-pack) for how to convert each answer
> into your own.

---

## Priority plan (if your prep time is short)

| Rank | Area | Why | Covers |
| ---- | ---- | --- | --- |
| **01** | MERN essentials | Highest priority — it is the job | Q1–54, Q124–130, Q141–153 |
| **02** | GenAI fundamentals & implementation | High priority | Q55–99, Q112–117 |
| **03** | Teaching demonstration | High priority — this is what they are hiring you for | Q100–111, Q131–140 |
| **04** | Advanced topics | Only after the fundamentals are solid | Q124–130, Q153 |

---

## Module index

| Course module | Relevant questions here |
| ------------- | ----------------------- |
| 1 — Web Dev Fundamentals Recap | Q1–15 (JavaScript), Q147–149 (array exercises) |
| 2 — React.js Components, Hooks & State | Q16–30, Q118–121, Q150, Q152 |
| 3 — Node.js & Express.js Backend | Q42–54, Q120 |
| 4 — MongoDB CRUD & Mongoose ODM | Q31–41, Q121 |
| 5 — REST API Integration & Data Flow | Q25, Q35, Q48, Q54, Q141 |
| 6 — Authentication, Security & Deployment | Q50–54, Q127, Q142, Q151, Q129–130 |
| 7 — Full Stack Capstone | Q134, Q141–146, Q154 recommendation |
| — GenAI (Prompt Engineering module) | Q55–99, Q112–117 |

---

# Part 1 — JavaScript fundamentals

### Q1. What is the difference between `var`, `let` and `const`?

- `var`: function-scoped and can be redeclared. It is hoisted and initialized with `undefined`.
- `let`: block-scoped and can be reassigned, but cannot be redeclared in the same scope.
- `const`: block-scoped and cannot be reassigned after initialization.

```javascript
var a = 10;
let b = 20;
const c = 30;

b = 25; // Valid
// c = 35; // TypeError
```

Important: `const` prevents reassignment of the variable, not mutation of an object stored in it.

### Q2. What is the difference between `==` and `===`?

- `==` compares values after possible type conversion.
- `===` compares values without type conversion.

```javascript
console.log(5 == "5");  // true
console.log(5 === "5"); // false
```

Prefer `===` in most application code because it avoids unexpected type coercion.

### Q3. What is a closure?

A closure occurs when a function retains access to variables from its surrounding lexical scope,
even after the outer function has finished executing.

```javascript
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
```

Here the returned function retains access to `count`. Closures are useful for maintaining private
state and implementing callbacks.

### Q4. Explain `map()`, `filter()`, `reduce()` and `forEach()`.

| Method | Purpose | Result |
| --- | --- | --- |
| `map()` | Transform every element | New array |
| `filter()` | Select matching elements | New array |
| `reduce()` | Accumulate a result | One accumulated value, or another value type |
| `forEach()` | Execute an action for each element | `undefined` |

```javascript
const marks = [60, 80, 45, 90];

console.log(marks.map(m => m + 5));      // [65, 85, 50, 95]
console.log(marks.filter(m => m >= 60)); // [60, 80, 90]
console.log(marks.reduce((sum, m) => sum + m, 0)); // 275
marks.forEach(m => console.log(m));
```

### Q5. What is destructuring?

Destructuring extracts values from arrays or properties from objects into variables.

```javascript
const student = { name: "Ravi", marks: 85 };
const { name, marks } = student;

console.log(name); // Ravi
console.log(marks); // 85
```

React commonly uses destructuring to access props and state values.

### Q6. What are spread and rest operators?

Both use `...`, but their purposes differ.

- **Spread**: expands an iterable or object into individual elements or properties.
- **Rest**: collects multiple elements or properties into one array or object.

```javascript
const oldMarks = [70, 80];
const newMarks = [...oldMarks, 90];

function total(...numbers) {
  return numbers.reduce((sum, n) => sum + n, 0);
}

console.log(newMarks);   // [70, 80, 90]
console.log(total(10, 20, 30)); // 60
```

### Q7. What is a Promise?

A Promise represents the eventual success or failure of an asynchronous operation. Its states are
pending, fulfilled and rejected.

```javascript
fetch("/api/students")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

A Promise lets code handle a result that may arrive later without blocking normal execution.

### Q8. Explain `async` and `await`.

`async` declares a function that returns a Promise. `await` pauses execution of that async function
until the awaited Promise settles; it does not block the entire JavaScript thread.

```javascript
async function getStudents() {
  try {
    const response = await fetch("/api/students");

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const students = await response.json();
    console.log(students);
  } catch (error) {
    console.error(error.message);
  }
}
```

### Q9. What is the difference between `null` and `undefined`?

- `undefined`: a value that has not been assigned, or a property does not exist.
- `null`: an intentional representation of no value.

```javascript
let a;
const student = { name: "Ravi" };

console.log(a);               // undefined
console.log(student.age);     // undefined
console.log(student.name);    // Ravi
console.log(student.address); // undefined
```

A property explicitly assigned `null` indicates the property exists but has no meaningful value.

### Q10. What are arrow functions, and how does `this` behave in them?

Arrow functions provide shorter function syntax and inherit `this` from their surrounding lexical
scope.

```javascript
const add = (a, b) => a + b;
console.log(add(10, 20)); // 30
```

Unlike ordinary functions, arrow functions do not create their own `this`. This matters in event
handlers, callbacks and object methods.

### Q11. What is JSON serialization?

Serialization converts data into a format suitable for transmission or storage.
`JSON.stringify()` converts supported JavaScript values into JSON text; `JSON.parse()` converts JSON
text back into JavaScript values.

```javascript
const student = { name: "Ravi", marks: 85 };
const jsonText = JSON.stringify(student);
const restored = JSON.parse(jsonText);

console.log(jsonText);
console.log(restored.name);
```

### Q12. How do you remove duplicates from an array?

```javascript
const numbers = [1, 2, 2, 3, 4, 4];
const uniqueNumbers = [...new Set(numbers)];

console.log(uniqueNumbers); // [1, 2, 3, 4]
```

A Set stores unique values. This preserves first-occurrence order for primitive values.

### Q13. How do you count character frequencies?

```javascript
function countCharacters(text) {
  const counts = {};

  for (const char of text) {
    counts[char] = (counts[char] || 0) + 1;
  }

  return counts;
}

console.log(countCharacters("hello"));
// { h: 1, e: 1, l: 2, o: 1 }
```

### Q14. What is the difference between synchronous and asynchronous code?

Synchronous code runs sequentially; each operation generally completes before the next statement
proceeds. Asynchronous operations allow the program to continue while waiting for operations such as
network requests or file I/O.

A synchronous calculation may finish immediately, whereas an API request may take hundreds of
milliseconds. Node.js uses asynchronous I/O to serve many concurrent requests efficiently.

### Q15. What is the JavaScript event loop?

The event loop coordinates the execution of synchronous JavaScript and queued asynchronous callbacks.

```
Call Stack
    |
    v
Run synchronous code
    |
    v
Process microtasks (e.g. Promise callbacks)
    |
    v
Process eligible task callbacks
    |
    +----> Repeat
```

The real scheduling rules are more detailed. The interview point: asynchronous I/O can progress
without blocking the JavaScript thread while it waits.

---

# Part 2 — React.js

### Q16. What is React?

React is a JavaScript library for building user interfaces from reusable components. It helps
developers manage UI state and update the rendered interface when data changes.

For example, a college portal can have reusable `Navbar`, `StudentForm`, `StudentList` and `Footer`
components.

### Q17. What is the difference between a component and an element?

- A **component** is a function or other React definition that describes UI behaviour and structure.
- A React **element** is a description of what React should render.

```javascript
function Welcome() {
  return <h1>Welcome</h1>;
}

const element = <Welcome />;
```

`Welcome` is the component; `<Welcome />` creates a React element.

### Q18. What are props and state?

**Props** are inputs passed from a parent component to a child. **State** is data a component
manages over time.

```javascript
import { useState } from "react";

function Student({ name }) {
  const [marks, setMarks] = useState(70);

  return (
    <div>
      <p>{name}: {marks}</p>
      <button onClick={() => setMarks(marks + 5)}>
        Improve marks
      </button>
    </div>
  );
}
```

The `name` value comes from props; `marks` is state.

### Q19. What is the Virtual DOM?

The Virtual DOM is a conceptual in-memory representation of the rendered UI. React uses its
rendering and reconciliation process to determine what needs to change in the actual DOM.

Do not say that React always updates only one DOM node or that every render causes a complete DOM
replacement. Actual updates depend on the component tree, reconciliation and rendering environment.

### Q20. Explain `useState`.

`useState` is a React Hook that lets a function component store state.

```javascript
const [count, setCount] = useState(0);
```

- `count` is the current state value.
- `setCount` requests an update.
- `0` is the initial value.

React schedules a re-render when state changes. For updates based on the previous state, use:

```javascript
setCount(previous => previous + 1);
```

This is safer when multiple updates may be queued.

### Q21. Explain `useEffect`.

`useEffect` synchronizes a component with external systems, such as API requests, subscriptions or
browser APIs.

```javascript
import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function loadStudents() {
      const response = await fetch("/api/students");
      const data = await response.json();
      setStudents(data);
    }

    loadStudents();
  }, []);

  return <p>Students loaded: {students.length}</p>;
}
```

The empty dependency array means the effect is set up after the component mounts, with additional
development behaviour possible under React Strict Mode. Production-quality code should also handle
HTTP errors, loading states, cleanup where needed, and stale requests.

### Q22. What are controlled and uncontrolled components?

A controlled form input gets its value from React state.

```javascript
const [name, setName] = useState("");

<input
  value={name}
  onChange={(event) => setName(event.target.value)}
/>
```

An uncontrolled input keeps its current value in the DOM, commonly accessed through a ref.

Controlled inputs are useful when you need validation, conditional rendering or immediate access to
the form state.

### Q23. Why are keys important when rendering lists?

Keys help React identify which items have changed, been added or been removed.

```javascript
students.map(student => (
  <p key={student._id}>{student.name}</p>
))
```

A stable unique ID is preferable. Array indexes can cause incorrect state association when items
are inserted, removed or reordered.

### Q24. How do you handle form validation?

Use both frontend and backend validation.

- Frontend: provide immediate feedback to the user.
- Backend: independently validate all incoming data before accepting it.

For a student registration form, validate required fields, email format, password requirements and
any domain-specific constraints. Frontend validation improves usability but is not a security
boundary.

### Q25. How do you call a backend API using `fetch` or Axios?

```javascript
async function loadStudents() {
  const response = await fetch("/api/students");

  if (!response.ok) {
    throw new Error("Unable to load students");
  }

  return response.json();
}
```

Axios alternative:

```javascript
import axios from "axios";

const response = await axios.get("/api/students");
console.log(response.data);
```

The caller should handle errors and represent loading, success and failure states in the UI.

### Q26. What is React Router?

React Router enables navigation between views in a React application without requiring a full
browser page reload for each client-side route.

Examples include `/login`, `/students` and `/students/123`. A route guard can improve navigation
behaviour, but backend authorization is still required to protect data.

### Q27. What is prop drilling?

Prop drilling occurs when data is passed through multiple intermediate components that do not
themselves need it.

Solutions include component composition, Context API and state-management libraries such as Redux.
Choose the simplest solution appropriate to the component tree.

### Q28. What is client-side rendering versus server-side rendering?

- **Client-side rendering (CSR):** JavaScript in the browser renders the interface.
- **Server-side rendering (SSR):** the server generates HTML for the requested page, which can then
  be hydrated on the client.

CSR is common in React applications created with Vite. SSR frameworks such as Next.js support server
rendering, which can improve initial content delivery and search-engine discoverability in suitable
applications.

### Q29. How do you prevent unnecessary re-renders?

Use good component boundaries and avoid unnecessary state changes first. Depending on the measured
performance problem, consider:

- `React.memo` for memoizing eligible component renders.
- `useMemo` for caching expensive calculations.
- `useCallback` for stabilizing function references when useful.
- Keeping state close to the components that need it.
- Virtualizing very large lists.

These tools are not automatically beneficial everywhere. Profile before optimizing.

### Q30. How do you manage loading, error and empty states?

Maintain separate UI states for the request lifecycle.

```javascript
if (loading) return <p>Loading students...</p>;
if (error) return <p>Unable to load students.</p>;
if (students.length === 0) return <p>No students found.</p>;

return students.map(student => (
  <p key={student._id}>{student.name}</p>
));
```

This prevents a blank screen from being mistaken for a successful request.

---

# Part 3 — MongoDB and Mongoose

### Q31. What is MongoDB, and how is it different from MySQL?

MongoDB is a document-oriented NoSQL database. MySQL is a relational database that organizes data
into tables with rows and columns.

| Feature | MongoDB | MySQL |
| --- | --- | --- |
| Main structure | Documents and collections | Rows and tables |
| Data format | BSON documents | Relational records |
| Relationships | References or embedded documents | Foreign keys and joins |
| Schema | Flexible, with optional enforcement and validation | Defined relational schema |
| Query language | MongoDB query API | SQL |
| Typical use | Flexible document-centric applications | Structured relational applications |

Both support indexing, transactions and validation. Neither is universally better; the data model
and application requirements determine the choice.

### Q32. What is a document, collection and database?

Think of a college filing system.

- **Database:** the entire filing cabinet for an application.
- **Collection:** a folder containing similar records.
- **Document:** one individual record.

Example MongoDB document:

```json
{
  "name": "Ravi",
  "department": "CSE",
  "marks": 85
}
```

This document might belong to the `students` collection in the `college` database.

### Q33. What is BSON, and how does it differ from JSON?

JSON is a text-based data interchange format. BSON is a binary-encoded format used internally by
MongoDB that supports additional data types, including dates and ObjectIds.

MongoDB documents can be represented as JSON-like objects in application code, but the stored BSON
representation is not identical to plain JSON text.

### Q34. What is `_id`?

`_id` is the unique primary identifier of a MongoDB document within its collection. MongoDB
automatically generates an ObjectId if one is not supplied.

In Mongoose:

```javascript
const student = await Student.findById(id);
```

The ID is used to identify a specific student record.

### Q35. What is CRUD?

CRUD stands for Create, Read, Update and Delete.

| Operation | HTTP example | Mongoose example |
| --- | --- | --- |
| Create | POST | `Student.create(data)` |
| Read | GET | `Student.find()` |
| Update | PATCH | `Student.findByIdAndUpdate(id, data)` |
| Delete | DELETE | `Student.findByIdAndDelete(id)` |

A REST API typically maps these operations to resources such as `/api/students`.

### Q36. What are Mongoose schemas and models?

A schema describes the structure, field types and validation rules of a document. A model provides
an interface for querying and modifying documents in a collection.

```javascript
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  marks: { type: Number, min: 0, max: 100 }
});

const Student = mongoose.model("Student", studentSchema);
```

The `unique` option creates a uniqueness constraint through an index; it is not a substitute for
handling duplicate-key errors.

### Q37. What is the difference between `find()`, `findOne()` and `findById()`?

- `find()` returns matching documents as an array.
- `findOne()` returns the first matching document or null.
- `findById()` finds a document by its `_id` or returns null.

```javascript
await Student.find({ department: "CSE" });
await Student.findOne({ email: "ravi@example.com" });
await Student.findById(studentId);
```

### Q38. How do you validate data before saving it?

Use Mongoose schema validation and validate request data at the API boundary.

```javascript
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  marks: { type: Number, min: 0, max: 100, required: true }
});
```

Validate data before database operations and return appropriate HTTP 400 responses for invalid
input. Do not trust values simply because they came from a React form.

### Q39. What are indexes, and why are they important?

Indexes allow MongoDB to locate matching records more efficiently without scanning every document in
many common queries.

```javascript
studentSchema.index({ department: 1 });
```

The trade-off is additional storage and write overhead. Index fields that match actual query
patterns, and inspect query performance rather than indexing every field.

### Q40. How would you model users and orders?

A common design stores orders separately and references the user.

```json
{
  "userId": "USER_OBJECT_ID",
  "items": [
    {
      "productId": "PRODUCT_OBJECT_ID",
      "quantity": 2
    }
  ],
  "total": 1500
}
```

This avoids embedding an unlimited number of orders in one user document. Embedding is also
appropriate for small, bounded data that is usually read with its parent.

### Q41. How do you connect Express to MongoDB using Mongoose?

```javascript
const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}

connectDB().catch((error) => {
  console.error("Database connection failed", error);
  process.exit(1);
});
```

Store the connection string in an environment variable, not in source code. A production application
should not start accepting requests until its required database connection is ready.

---

# Part 4 — Node.js, Express.js and REST APIs

### Q42. What is Node.js? Is it a programming language?

Node.js is a JavaScript runtime that runs JavaScript outside the browser, powered by the V8 engine.
JavaScript is the programming language; Node.js provides APIs for networking, files and other
server-side operations.

### Q43. What is Express.js?

Express.js is a web framework for Node.js. It simplifies routing, middleware, request handling and
API development.

```javascript
const express = require("express");
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.listen(5000);
```

### Q44. What is middleware?

Middleware is a function in the request-response processing pipeline. It can inspect or modify a
request, perform authentication, log activity, handle errors or end the response.

```javascript
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
```

`next()` passes control to the next applicable middleware or route handler. A middleware function can
instead send a response or forward an error.

### Q45. Explain `req`, `res` and `next`.

- `req`: the incoming HTTP request, including parameters, query strings and body.
- `res`: the response used to send data and status codes.
- `next`: passes control onward or forwards an error when called with an error.

```javascript
app.get("/students/:id", (req, res) => {
  res.json({ id: req.params.id });
});
```

For `/students/123`, the route parameter is `"123"`.

### Q46. Explain GET, POST, PUT, PATCH and DELETE.

| Method | Typical purpose |
| --- | --- |
| GET | Retrieve a resource |
| POST | Create a resource or perform an operation |
| PUT | Replace a resource representation |
| PATCH | Partially update a resource |
| DELETE | Delete a resource |

GET should not be used to make ordinary state-changing requests. PUT is generally defined as
idempotent, meaning repeating the same request has the same intended effect; POST is not inherently
idempotent.

### Q47. What are HTTP status codes?

- `200 OK`: successful request.
- `201 Created`: resource successfully created.
- `400 Bad Request`: invalid request.
- `401 Unauthorized`: authentication is missing or invalid.
- `403 Forbidden`: the caller is not permitted to perform the operation.
- `404 Not Found`: requested resource not found.
- `500 Internal Server Error`: unexpected server-side failure.

Use status codes consistently and avoid returning 200 for every outcome.

### Q48. What is CORS?

Cross-Origin Resource Sharing is a browser security mechanism that controls whether frontend
JavaScript from one origin can access responses from another origin.

For example, a React application on port 5173 may call an Express server on port 5000. The backend
must permit the appropriate origin if the browser would otherwise block the request.

```javascript
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173"
}));
```

CORS is not authentication. It does not prevent non-browser clients from calling an API.

> **Live example from this project:** in `RECREATE.md` → Part 4, defect #3 — `cors` was in
> `package.json` but never imported. The symptom was a browser console CORS error while `curl`
> worked perfectly. Worth telling this story in an interview.

### Q49. How do you handle errors in Express?

Use appropriate error responses, centralized error middleware, and `try...catch` around asynchronous
operations when required by the Express version and coding pattern.

```javascript
app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) return next(err);

  res.status(500).json({
    message: "Internal server error"
  });
});
```

Do not expose stack traces, database credentials or internal implementation details to clients in
production.

### Q50. What is JWT authentication?

A JSON Web Token (JWT) is a token format commonly used to carry signed claims. After successful
login, a server may issue a token that the client presents with later requests.

Typical flow:

1. The user submits credentials.
2. The server verifies the password against a securely stored hash.
3. The server issues a signed token with appropriate expiry and claims.
4. The client sends the token with a protected request.
5. The server verifies the signature and claims before granting access.

A signed JWT is not automatically encrypted. Do not put passwords or other secrets in its payload.

### Q51. How do you secure passwords?

Hash passwords using an established password-hashing algorithm such as Argon2id or bcrypt with an
appropriate work factor. Do not store plaintext passwords or use ordinary SHA-256 alone as a
password-storage scheme.

Also implement login rate limits, safe password-reset flows, secure session/token handling and
HTTPS.

### Q52. What is authentication versus authorization?

- **Authentication:** establishes who the user is.
- **Authorization:** determines what that user is allowed to do.

A student can be authenticated but still be unauthorized to access another student's private
records.

### Q53. How would you protect routes using JWT?

Write middleware that extracts the token, verifies its signature and expiry, and sets the
authenticated identity on the request. The route must then enforce authorization against the
requested resource.

A valid token alone does not prove that the caller owns every record they try to access.

### Q54. How do you debug a failing API request?

Use a systematic approach:

1. Inspect the browser Network tab.
2. Check the request URL, method, headers and body.
3. Inspect the response status and response body.
4. Check Express logs.
5. Confirm that the backend is running and the route exists.
6. Verify database connectivity and query filters.
7. Check CORS configuration if the browser blocks the request.
8. Reproduce the request with an API client such as Postman or `curl`.

The key is to isolate the layer where the failure occurs instead of randomly changing code.

---

# Part 5 — GenAI fundamentals

### Q55. What are AI, ML, deep learning and Generative AI?

- **Artificial Intelligence (AI):** the broad field of creating systems that perform tasks
  associated with intelligence.
- **Machine Learning (ML):** techniques that learn patterns from data.
- **Deep Learning:** ML based on multi-layer neural networks.
- **Generative AI:** systems that generate new content, such as text, images, audio or code.

These concepts are related, but not synonymous.

### Q56. What is a Large Language Model (LLM)?

An LLM is a model trained on large amounts of text and other data to process and generate language.
Many modern LLMs use transformer architectures and predict tokens conditioned on their context.

They can support summarization, question answering, code generation, classification and many other
tasks, but their outputs require appropriate validation.

### Q57. How does ChatGPT generate an answer?

At a high level, the model processes the input context and generates a sequence of output tokens
according to learned patterns and the model's decoding procedure. The generated tokens are then
presented as a response.

This is not the same as searching a database for an exact stored answer. Depending on the system,
tools, retrieval, safety checks and other processing may also be involved.

### Q58. What are tokens and context windows?

- **Tokens:** units of text or other content processed by the model; they may be words, word
  fragments or punctuation.
- **Context window:** the maximum amount of supported input and output context the model can process
  for a request, subject to the particular model's limits.

Tokens affect cost, latency and how much conversation or document content can fit into a request.

### Q59. What is a transformer?

A transformer is a neural-network architecture that uses attention mechanisms to model relationships
among elements in a sequence.

Self-attention helps the model relate different tokens in the context. Transformers are foundational
to many contemporary language models, although not every AI model uses this architecture.

### Q60. What are parameters?

Parameters are learned numerical values inside a model, adjusted during training. They influence the
model's behaviour.

A larger parameter count does not guarantee superior results on every task; architecture, training
data, inference methods and evaluation also matter.

### Q61. What is the difference between training and inference?

- **Training:** the model's parameters are optimized using data and a training objective.
- **Inference:** the trained model processes new input and produces output.

When a developer calls an LLM API to generate a response, they are generally performing inference, not
retraining the model.

### Q62. What are temperature and top-p?

Both influence sampling during generation.

- **Temperature:** changes the distribution of possible next tokens. Higher values generally produce
  more varied outputs; lower values tend to be more predictable.
- **Top-p:** restricts sampling to a set of likely tokens whose cumulative probability reaches a
  configured threshold.

These parameters do not guarantee factual correctness. Their exact behaviour and availability depend
on the model and API.

### Q63. What are hallucinations?

A hallucination is an output that is unsupported, fabricated or incorrect despite being presented
confidently.

Ways to reduce risk include:

- Ground answers in reliable source material.
- Retrieve relevant documents.
- Ask the model to state uncertainty or abstain when evidence is insufficient.
- Validate structured outputs and factual claims.
- Use citations and human review for high-impact decisions.

No prompting technique guarantees the complete elimination of hallucinations.

### Q64. What is the difference between proprietary and open-weight models?

A proprietary model is typically accessed under a provider's terms, often through a hosted API. An
open-weight model makes its learned weights available under a specified license.

Open weights do not necessarily mean the training data, training code or every part of the system is
open. Licensing, deployment cost, hardware, privacy and performance must all be considered.

---

# Part 6 — Prompt engineering

### Q65. What is prompt engineering?

Prompt engineering is the practice of designing instructions, context and examples to guide a model
toward a useful output.

A good prompt often specifies:

- The task and role.
- Relevant background information.
- Constraints and boundaries.
- The desired output format.
- Examples, when helpful.
- Criteria for success.

For example, instead of asking "Explain databases", ask "Explain MongoDB collections and documents
to first-year computer science students using one college-registration example and a five-question
quiz."

### Q66. What are system, user and assistant messages?

These are common conversation roles in LLM interfaces.

- **System:** high-level instructions or behavioural constraints supplied by the application or
  platform.
- **User:** the person's input or request.
- **Assistant:** the model's response.

Some APIs also support developer messages and tool messages. The exact roles and precedence rules
vary by API.

### Q67. What is zero-shot versus few-shot prompting?

- **Zero-shot:** provide instructions without task examples.
- **Few-shot:** provide a small number of examples showing the desired input-output behaviour.

Zero-shot: "Classify this review as positive or negative."

Few-shot: include two or three labelled review examples before the new review.

Few-shot examples can clarify formatting and classification boundaries but do not guarantee correct
answers.

### Q68. What is role prompting?

Role prompting gives the model a perspective or task identity.

"You are a patient programming tutor. Explain JavaScript promises to a beginner using a small
example."

This can guide tone and focus, but declaring a role does not give the model genuine professional
credentials or guarantee expertise.

### Q69. How do you constrain an LLM to return JSON?

Provide an explicit schema and use the API's supported structured-output or JSON-schema feature when
available. Then validate the response before consuming it.

Example of a desired output:

```json
{
  "question": "What is React?",
  "difficulty": "beginner",
  "answer": "React is a JavaScript UI library."
}
```

Do not rely on prompt instructions alone when downstream code depends on a strict schema.

### Q70. How do you improve a vague prompt?

Start by defining the task, audience, context, constraints and success criteria.

Weak prompt: "Create questions."

Improved prompt: "Generate 10 beginner-level MCQs on JavaScript arrays for first-year undergraduate
students. Include four options, one correct answer, a brief explanation and a difficulty label.
Return valid JSON."

### Q71. What are prompt templates?

Prompt templates are reusable structures containing fixed instructions and variable fields.

```
You are a programming tutor.

Topic: {topic}
Student level: {level}
Number of examples: {count}

Explain the topic and include the requested examples.
```

Templates standardise outputs across applications, but inserted user content must still be validated
and treated as untrusted input.

### Q72. What is prompt injection?

Prompt injection is an attempt to manipulate an AI system through malicious or conflicting
instructions in user input or retrieved content.

For example, a document supplied to a college chatbot might contain instructions to reveal
confidential information.

Mitigations include separating trusted instructions from untrusted content where supported, limiting
tool permissions, enforcing access control outside the model, validating tool arguments and never
allowing retrieved text to override application security rules.

### Q73. How do you evaluate prompts?

Use a representative test dataset and evaluate:

- Factual accuracy.
- Relevance to the question.
- Completeness.
- Format compliance.
- Safety.
- Latency and token cost.

Compare different prompts against the same examples. Human review and task-specific automated tests
are preferable to relying only on whether a response sounds convincing.

### Q74. Can prompt engineering completely eliminate hallucinations?

No. Prompts can reduce errors but cannot guarantee factual accuracy. Grounding, retrieval,
validation, evaluation and human review provide additional controls.

For high-stakes use cases, a system should be designed to abstain or request review when the evidence
is inadequate.

---

# Part 7 — RAG, embeddings and vector databases

### Q75. What is Retrieval-Augmented Generation (RAG)?

RAG combines information retrieval with generation. The application retrieves relevant external
content and supplies it to the model as context for answering a question.

Example: a college chatbot retrieves the relevant section of an examination policy PDF and asks the
model to answer based on that section.

```
Question from student
        ↓
Retrieve relevant document chunks
        ↓
Send question + retrieved context to LLM
        ↓
Answer, ideally with source references
```

### Q76. Why use RAG instead of fine-tuning for a college knowledge assistant?

RAG is often the better starting point when answers must reflect a changing collection of
documents, such as current timetables, policies and course notes.

Documents can be updated in the retrieval index without retraining the model.

Fine-tuning is more appropriate when the goal is to adapt a model's behaviour, style or task
performance using suitable training examples. The techniques can also be combined.

### Q77. What are embeddings?

Embeddings are numerical vectors representing content such as text. A suitable embedding model maps
semantically related texts to vectors that can be compared using a similarity measure.

For example, "How do I reset my password?" and "I forgot my login credentials" may have similar
embeddings despite using different words.

Embeddings capture useful patterns but do not guarantee that two texts mean exactly the same thing.

### Q78. What is semantic search?

Semantic search finds content based on meaning rather than only exact keyword matches. It commonly
uses embeddings to identify relevant documents or chunks.

Keyword search and semantic search can be combined in hybrid retrieval to improve results, especially
when exact identifiers or technical terms matter.

### Q79. What is a vector database?

A vector database stores vectors and supports similarity search, often alongside metadata and
references to original content.

It can help a RAG application find document chunks relevant to a user's question. Examples include
specialized vector databases and vector-search capabilities built into broader databases.

### Q80. What are chunking and chunk overlap?

- **Chunking:** splitting a large document into smaller sections for indexing and retrieval.
- **Chunk overlap:** repeating some content between neighbouring chunks to preserve context across
  boundaries.

Very large chunks may retrieve too much irrelevant text; very small chunks may lose important
context. The appropriate size depends on the documents, embedding model and retrieval method.

### Q81. How does a PDF become searchable by an LLM?

A common ingestion pipeline is:

1. Extract text from the PDF or use OCR if it contains scanned pages.
2. Clean and split the text into chunks.
3. Generate embeddings for each chunk.
4. Store embeddings, text and metadata in a search index.
5. Embed the user's query and retrieve relevant chunks.
6. Supply retrieved content to the LLM.
7. Return an answer with appropriate source references.

The LLM does not automatically gain permanent knowledge of the PDF simply because it was uploaded to
an application.

> **Note on the supplied PDF:** `MERN-interview.pdf` has no text layer — it is 49 pages of scanned
> JPEG images. Extracting text from it needs OCR first. That is exactly the "extract text or use OCR
> if it contains scanned pages" step above, demonstrated on a real document.

### Q82. How do you reduce irrelevant retrieval results?

Improve document extraction and chunking, choose an appropriate embedding model, apply metadata
filters, tune the number of retrieved chunks, consider reranking and evaluate retrieval quality on
representative questions.

Also enforce document-level permissions during retrieval. A semantically relevant private document
must not be exposed to an unauthorized user.

### Q83. What is the difference between RAG and fine-tuning?

| RAG | Fine-tuning |
| --- | --- |
| Retrieves external context at inference time | Updates model parameters through training |
| Useful for changing knowledge sources | Useful for adapting behaviour or task performance |
| Documents can be updated in the retrieval system | New training may be needed for further adaptation |
| Can provide references to retrieved sources | Does not inherently provide source citations |

Neither guarantees correctness, and fine-tuning should not be treated as a reliable way to make a
model memorise a large changing knowledge base.

### Q84. How would you build a chatbot for college PDFs?

I would build a React chat interface, an Express API and a document-ingestion pipeline. The backend
would extract and chunk PDF text, generate embeddings, store indexed chunks, retrieve relevant
passages for each question and call an LLM with the retrieved context.

I would add authentication, document permissions, source citations, request limits, error handling
and tests for answer accuracy. If evidence is insufficient, the chatbot should say so rather than
invent a policy.

---

# Part 8 — Building GenAI applications with MERN

### Q85. What is an LLM API?

An LLM API lets an application send input to a language model and receive generated output. It
usually exposes parameters for model selection, messages, token limits and other supported
generation settings.

In a MERN application, the Express backend commonly calls the provider's API and sends the
necessary result to React.

### Q86. How do you integrate an AI API into Node.js?

The general process is:

1. Select a model provider and API.
2. Store the API key in a backend environment variable.
3. Validate the user's request.
4. Call the provider from Express using its supported SDK or HTTP API.
5. Handle errors, timeouts and rate limits.
6. Return the generated result to the frontend.

```javascript
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAnswer(question) {
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      {
        role: "user",
        content: question
      }
    ]
  });
  return response.choices[0].message.content;
}
```

The model identifier must be configured for a model supported by the selected account and API. A
deployed application also needs validation, authorization, limits and error handling.

### Q87. Why should API keys not be exposed in React code?

React code runs in the user's browser, so bundled secrets can be inspected by anyone who accesses
the application. A malicious user could extract the key and use it independently, potentially
creating charges or abusing the account.

Keep the key on the backend, load it through environment configuration and apply provider-side
limits where available.

### Q88. How do you handle API rate limits and timeouts?

Use bounded retries with exponential backoff and jitter for appropriate transient errors, respect
retry instructions such as `Retry-After`, set request timeouts, and limit concurrent requests.

Do not retry indefinitely or blindly retry every error. Use quotas, monitoring and graceful error
messages when the provider remains unavailable.

### Q89. How do you stream an AI response to the browser?

The backend consumes the provider's streaming response and forwards text chunks to the client using
a supported streaming protocol, commonly Server-Sent Events (SSE) or streaming fetch responses.

The React UI appends incoming chunks as they arrive. The implementation must handle disconnects,
cancellation, partial responses and errors. WebSockets may be appropriate when full bidirectional
communication is required.

### Q90. What is function calling or tool calling?

Tool calling lets a model request that the application execute a defined function, such as looking
up a student's timetable or searching an approved document store.

The application validates the tool request, checks permissions, executes the operation and returns
the result to the model if needed.

The model's request is not itself proof of authorization. The backend must enforce all access
controls.

### Q91. What is an AI agent, and how does it differ from a basic chatbot?

A basic chatbot primarily responds to user messages. An AI agent can select tools, perform multiple
steps, observe results and continue toward a defined goal.

For example, a college assistant might search the examination schedule, check a student's permitted
records and summarize the result. Such actions need bounded permissions, clear stopping conditions,
logging and appropriate human approval.

Not every chatbot requires an agent framework.

### Q92. What are LangChain and similar frameworks?

LangChain and related orchestration frameworks provide reusable abstractions for model calls, prompt
templates, retrieval, tools and multi-step workflows.

They can speed up development, but they are not mandatory. For a small application, a provider SDK
and ordinary JavaScript may be simpler and easier to teach.

### Q93. How would you store chat history in MongoDB?

Use separate conversation and message documents or a suitable embedded structure for bounded
conversations.

```json
{
  "conversationId": "CONVERSATION_ID",
  "userId": "USER_OBJECT_ID",
  "role": "user",
  "content": "Explain recursion",
  "createdAt": "2026-10-22T10:00:00Z"
}
```

In production, enforce ownership checks on every conversation query, define retention rules and
consider the storage and privacy implications of retaining prompts and responses.

### Q94. How do you track token usage, latency and cost?

Record model identifier, request time, latency, success or failure, token usage returned by the
provider and estimated cost using the provider's current pricing.

Aggregate usage by application, user or course, while avoiding unnecessary storage of sensitive
prompt content. Add quotas and alerts to detect abnormal consumption.

### Q95. How would you build an AI-powered quiz generator?

I would create a React form for the subject, topic, difficulty and question count. Express would
validate the request, call an LLM with a structured-output schema, validate the returned questions
and save them in MongoDB.

Before using the questions for graded assessments, I would check answer correctness, ambiguity,
syllabus alignment and difficulty. AI-generated answer keys should not be accepted as correct
without verification.

### Q96. How would you provide AI feedback on assignments?

I would give the model a clear rubric, the student's submitted work and the relevant learning
objectives. The model would return criterion-level feedback, evidence and suggested improvements in
a structured format.

I would use human review for consequential grading, communicate the limits of automated assessment
and avoid submitting personally identifiable student data unless permitted by the applicable policy
and system safeguards.

### Q97. What if the AI API goes down?

Display a clear error, preserve the user's input where possible, use bounded retries for transient
failures and provide a useful alternative, such as manual access to course resources.

If an alternative provider is configured, switch only when it is compatible with the required
functionality and security controls. Never silently present fabricated AI output as a successful
response.

### Q98. How do you control AI usage costs?

- Set reasonable input and output token limits.
- Select a model appropriate to the task.
- Avoid sending unnecessary conversation history.
- Cache suitable repeated results.
- Enforce per-user quotas and rate limits.
- Monitor token consumption and cost.
- Use retrieval to avoid repeatedly transmitting entire documents.
- Alert on unusual usage.

The lowest-cost model is not always the best choice if quality requirements are not met.

### Q99. How can AI-generated code be unsafe?

Generated code may contain insecure authentication, SQL or NoSQL injection risks, exposed secrets,
unsafe dependency choices, missing authorization checks or incorrect assumptions.

Review and test the code, inspect dependencies, use static analysis where appropriate and verify
authorization and input validation. AI-generated code should be treated as untrusted until reviewed.

---

# Part 9 — Teaching methodology and classroom management

### Q100. How would you teach MERN Stack to students who know only HTML, CSS and JavaScript?

I would teach the stack progressively rather than introducing all four technologies simultaneously.

1. Revise JavaScript fundamentals, ES6 and asynchronous programming.
2. Build a small React application using components, props and state.
3. Introduce HTTP, REST APIs and Express.
4. Teach MongoDB and Mongoose through basic CRUD operations.
5. Connect React to the backend.
6. Add validation, authentication, testing and deployment.
7. Finish with a project that students can explain independently.

Each stage should include a working exercise before the next layer is introduced.

### Q101. How would you explain frontend versus backend to a beginner?

I would compare a web application to a restaurant.

- **Frontend:** the menu and the interface through which the customer places an order.
- **Backend:** the staff who process the order and enforce business rules.
- **Database:** the organized records of customers, orders and inventory.
- **API:** the agreed communication method through which the frontend requests operations from the
  backend.

The analogy helps students understand why the interface and the database have different
responsibilities.

### Q102. How would you teach students with different skill levels?

I would use a common core exercise and differentiated extensions.

- Beginners receive starter code, guided steps and additional examples.
- Intermediate students complete the same task with fewer hints.
- Advanced students add validation, tests, performance improvements or extra features.

I would assess individual understanding rather than assuming that a completed group project means
every student understands the code.

### Q103. What if half the class cannot complete an exercise?

I would pause and diagnose the common difficulty rather than continue the syllabus blindly.

I would ask students to identify the first step they cannot explain, inspect a representative error,
demonstrate the missing concept and provide a smaller exercise. Once most students can complete that
exercise, I would return to the original task.

I would also adjust the pacing and review whether the prerequisites had been taught adequately.

### Q104. How do you balance theory, live coding and practice?

I would introduce the concept briefly, demonstrate it through a small example, then give students a
related coding task.

A practical session might allocate roughly **20% to concept explanation, 30% to demonstration and
50% to student practice and feedback.** The exact allocation should depend on the complexity of the
topic and the students' progress.

### Q105. How would you explain React hooks without overwhelming students?

I would start with one problem: displaying a counter that changes when a button is clicked.

First, show a normal variable and explain why changing it does not automatically update the React UI.
Then introduce `useState` as the mechanism for storing UI state. After that, introduce `useEffect`
using a real external interaction, such as fetching student records.

I would teach one Hook at a time and discuss dependency arrays and cleanup only when students are
ready.

### Q106. How do you assess whether students understand code they copied from a tutorial?

I would ask students to explain the data flow, predict the output, modify a requirement, debug an
intentional error and rebuild one small part without looking at the original.

For example, after they copy a CRUD application, I might ask them to add a field, validate it and
explain how the new field travels from React to MongoDB.

> **Direct application:** this is exactly the exercise built into `RECREATE.md` → Part 4 (the nine
> defects). Give students the broken app and ask them to find the bugs and explain the symptom each
> one produced.

### Q107. How do you teach debugging rather than simply giving the answer?

I would teach a repeatable debugging process:

1. Reproduce the error.
2. Read the error message carefully.
3. Identify the failing layer.
4. Form a hypothesis.
5. Test one change at a time.
6. Verify the fix and explain why it works.

The aim is to help students become independent problem-solvers.

### Q108. How do you handle students using ChatGPT for assignments?

I would establish clear rules about permitted AI use and require students to disclose substantial AI
assistance where the course policy requires it.

I would design assessments around understanding: code walkthroughs, oral explanations, debugging,
incremental modifications and individualized follow-up questions. I would evaluate learning outcomes
rather than relying on unreliable AI-detector scores.

### Q109. How would you design a practical MERN examination?

I would define explicit learning outcomes and use a rubric covering functionality, code quality, API
correctness, database design, validation, error handling, testing and the student's ability to
explain the implementation.

For example, a student could build a student-management API and React interface within a defined
time. The rubric should reward correct reasoning and working functionality, not merely visual polish.

### Q110. How do you measure learning outcomes?

I would use pre-assessments, short quizzes, coding exercises, project milestones and practical
demonstrations. I would compare performance against defined learning objectives and identify topics
where students repeatedly struggle.

Attendance and project completion alone are insufficient measures of technical understanding.

### Q111. How would you finish a syllabus within a fixed academic calendar?

I would map every syllabus outcome to a lesson, practical exercise and assessment. I would identify
prerequisites, prioritize core competencies and reserve time for integration, revision and the
capstone.

I would track progress weekly and adjust the depth of optional topics before sacrificing essential
practice or assessment.

---

# Part 10 — GenAI teaching and responsible AI

### Q112. How would you teach prompt engineering to undergraduate students?

I would start with the same task written as a vague prompt and a structured prompt. Students would
compare the responses, identify missing constraints and improve the instructions.

Then I would introduce examples, output schemas, factual verification and prompt-injection risks.
Students would learn that prompt quality influences output but does not guarantee truth.

### Q113. How would you use GenAI to improve teaching efficiency?

I would use GenAI to create draft lesson outlines, quizzes, coding exercises, differentiated
explanations and practice datasets. I would review outputs for correctness, syllabus alignment,
accessibility and inappropriate content before giving them to students.

AI can accelerate preparation, but the trainer remains responsible for instructional quality.

### Q114. How would you teach students to verify AI-generated answers?

I would require students to identify claims, verify them against reliable documentation, run
generated code, test edge cases and explain any corrections.

For programming questions, students should use official documentation and executable tests rather
than accepting a response because it sounds confident.

### Q115. How would you teach AI ethics and privacy?

I would cover data minimization, consent, access control, bias, hallucinations, copyright
considerations, academic integrity and disclosure of AI use.

Students should not upload confidential institutional data, credentials or personally identifiable
information to an AI service unless the use is explicitly authorized and appropriately protected.

### Q116. How do you evaluate a GenAI application?

I would build a test set representing expected questions, difficult cases and misuse attempts. Then
I would measure task accuracy, relevance, groundedness, format compliance, latency, cost and safety.

For RAG applications, I would separately evaluate retrieval quality and the quality of the final
generated answer. Passing a few demonstrations is not sufficient evidence of reliability.

### Q117. How do you prevent a college chatbot from revealing private information?

I would enforce authentication, authorization and document-level permissions in the backend and
retrieval layer. The model should receive only content the current user is permitted to access.

I would also test direct requests for private data, indirect prompt injection, cross-user access and
attempts to invoke unauthorized tools. A prompt saying "never reveal private information" is not an
adequate security control.

---

# Part 11 — Live coding: model solutions

> Practise writing these from memory and explaining each line.

### Q118. Build a React counter

```javascript
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;
```

**What to explain:** `useState` stores the counter value. The click handler requests an update, and
React re-renders the UI with the new value.

### Q119. Build a controlled registration form

```javascript
import { useState } from "react";

function RegistrationForm() {
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    console.log({ name: name.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Student name"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
```

This is a teaching example, not a complete registration system. A real application needs backend
validation and persistence.

### Q120. Create basic Express CRUD routes

Assume `Student` is a Mongoose model.

```javascript
app.get("/api/students", async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    next(error);
  }
});

app.post("/api/students", async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/students/:id", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/students/:id", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
```

This demonstrates the CRUD pattern. For a real application, validate IDs and allowed fields,
prevent unauthorized updates, and map validation and duplicate-key errors to appropriate client
responses.

### Q121. Build a student search function

```javascript
function searchStudents(students, query) {
  const search = query.trim().toLowerCase();

  return students.filter(student =>
    student.name.toLowerCase().includes(search)
  );
}
```

This searches an existing array in memory. For large datasets, perform paginated searching on the
backend and use appropriately indexed query patterns.

### Q122. Generate quiz questions using GenAI

A simplified Express endpoint can validate the requested topic before calling a model:

```javascript
app.post("/api/quiz", async (req, res, next) => {
  try {
    const { topic, count } = req.body;

    if (
      typeof topic !== "string" ||
      !topic.trim() ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 10
    ) {
      return res.status(400).json({
        message: "Invalid topic or question count"
      });
    }

    // Call the configured LLM API here.
    // Validate its structured response before returning it.

    res.json({
      topic: topic.trim(),
      requestedCount: count,
      message: "Quiz generation step goes here"
    });
  } catch (error) {
    next(error);
  }
});
```

In an actual implementation, replace the placeholder with a model call, validate the generated
schema, verify the answer key and apply usage limits.

### Q123. Build a simple PDF question-answering application

The architecture would contain:

1. React file-upload and chat interface.
2. Express endpoints for ingestion and question answering.
3. A PDF text extraction library.
4. A chunking and embedding process.
5. A vector-search index and document metadata.
6. An LLM API call using retrieved chunks.
7. Source references, access controls and evaluation.

The essential interview point is that a reliable PDF chatbot needs a retrieval pipeline; merely
sending an enormous PDF or an arbitrary text extract to a model does not guarantee relevant answers.

---

# Part 12 — Deployment, security and production readiness

### Q124. How would you deploy a MERN application?

I would build the React frontend, deploy the backend to a suitable hosting environment, provision
MongoDB, configure environment variables and connect the frontend to the deployed API.

The deployment checklist includes:

- Correct production build and start commands.
- Secure environment configuration.
- HTTPS and restricted CORS origins.
- Database network access and credentials.
- API error handling and request logging.
- Health checks and monitoring.
- Build and deployment verification.

The exact steps depend on the chosen hosting provider.

> **Course mapping:** Module 6 names **Render** (backend) and **Vercel** (frontend). For this
> project: `backend/` → Render Web Service with `npm start` and `MONGO_URI` in the environment
> settings; `frontend/` → Vercel with `VITE_API_URL` pointing at the Render URL, and
> `const API = import.meta.env.VITE_API_URL || "http://localhost:8001/todo"` in `App.jsx`.

### Q125. What is the difference between development and production?

Development prioritizes rapid feedback, debugging and local experimentation. Production prioritizes
reliability, security, performance, monitoring and controlled releases.

A development server may use hot reload and verbose errors. A production application should use a
controlled build, secure secrets, suitable logging and user-safe error messages.

### Q126. What is an environment variable?

An environment variable supplies configuration to an application without hardcoding it in the source
code.

```
PORT=5000
MONGO_URI=...
OPENAI_API_KEY=...
```

Do not commit real secrets to Git. Use a local environment file excluded from version control and
the hosting provider's secret-management facilities in production.

> **Live example:** the original `config.js` hardcoded `mongodb://localhost:27017//todo` while a
> root `.env` sat unused. The `.env` file was decorative. That is a good interview story.

### Q127. How would you secure a MERN application?

I would implement:

- Authentication and resource-level authorization.
- Server-side input validation.
- Secure password hashing.
- HTTPS and appropriate cookie or token handling.
- Restricted CORS configuration.
- Rate limiting and abuse protection.
- Safe database queries and field allowlists.
- Secure secret management.
- Dependency updates and vulnerability scanning.
- Logging, monitoring and backup procedures.

Security must be enforced by the backend, not merely by hiding buttons in React.

### Q128. What is pagination, and why is it important?

Pagination retrieves a subset of records instead of loading an entire collection at once.

For example, an endpoint might return 20 students per page. This reduces response size and improves
responsiveness.

Offset-based pagination is simple, while cursor-based pagination can be more efficient and stable for
large or frequently changing datasets. The right choice depends on the query and indexing strategy.

### Q129. How would you test a MERN application?

I would test at multiple levels:

- **Unit tests:** individual functions and components.
- **Integration tests:** API routes and database interactions.
- **Component tests:** React rendering and user interactions.
- **End-to-end tests:** complete user journeys.

For example, a registration test should cover valid input, invalid input, duplicate email, server
failure and successful persistence. Testing should include negative cases, not only the happy path.

### Q130. How would you monitor a deployed application?

I would monitor request volume, latency, error rates, database health, resource utilization and
AI-provider usage where applicable.

Structured logs and request identifiers help trace failures across the frontend, backend, database
and AI provider. Alerts should focus on actionable failures rather than generating excessive noise.

---

# Part 13 — HR and project interview answers

> These are sample responses you can adapt to your actual experience.

### Q131. Tell us about yourself.

"I have a technical training background and focus on helping learners understand programming concepts
through practical demonstrations and project-based exercises. I am interested in teaching MERN Stack
because it connects frontend development, backend APIs and database operations in one coherent
learning path. I also want to help students understand how Generative AI can be integrated
responsibly into real applications. My approach is to explain concepts clearly, demonstrate working
code and encourage students to solve problems independently."

Personalize this with your actual projects, technologies taught and training experience.

### Q132. Why do you want to teach undergraduate students?

"I enjoy breaking complex technical topics into manageable concepts and helping students build
confidence through hands-on practice. Undergraduate students benefit from understanding not only
syntax but also how software systems work together. I would aim to develop their programming
fundamentals, debugging ability and project-building skills so they can apply what they learn
independently."

### Q133. Which technologies can you teach confidently?

A strong answer separates current competence from areas you are still developing.

"I can teach the technologies I have prepared and practised through structured demonstrations and
exercises. For each topic, I prepare working examples, common errors and assessment questions. Where
a technology is new to me, I verify the documentation and test the implementation before teaching
it."

Be specific about the tools you can genuinely demonstrate without assistance.

### Q134. Describe a full-stack project you have built or demonstrated.

Use this structure:

1. **Problem:** What user need did the project address?
2. **Frontend:** Which React components and interactions did you build?
3. **Backend:** Which Express routes and business rules did you implement?
4. **Database:** How did you model and validate the data?
5. **Security:** How did you handle authentication and access control?
6. **Deployment:** Where did you run the application?
7. **Challenges:** Which bug or design problem did you solve?
8. **Outcome:** What worked, and what would you improve?

Choose a project you can explain down to individual functions and API requests.

> **Use this project.** The MERN Todo app in this repository answers all eight points, and the eleven
> defects in `RECREATE.md` → Part 4 give you a genuinely interesting "challenges" answer — a
> `Todoodo` typo that returned 500 on every delete, a controller that fetched data but never sent
> it, a missing `cors()` call, a `.env` file that was never actually read, an edit button that
> silently wiped the content field, a stylesheet that was never imported, a native build
> dependency that could not compile on Windows at all, and a DNS resolver mismatch that worked in
> the browser but failed in the server. That is a far better story than "it worked on
> the first try", and it demonstrates the debugging skill the role needs.

### Q135. How would you explain architecture to a non-technical audience?

"I would start with the user's journey rather than the technology names. For example, when a student
submits a registration form, the interface sends the information to the backend, the backend
validates it and saves it in the database, and the application displays the result. Once that flow is
clear, I would explain the role of React, Express and MongoDB in more detail."

### Q136. What would you do if the syllabus requires a topic you have not taught before?

"I would review the official documentation, identify prerequisites and build a small working example.
I would test common failure cases and prepare exercises before introducing the topic in class. If
necessary, I would communicate a realistic preparation plan to the coordinator rather than
improvising an unverified explanation."

### Q137. How do you keep your knowledge current?

"I follow official documentation, release notes and reputable technical learning resources. I
validate important changes by implementing small examples and checking compatibility. When preparing
a lesson, I distinguish stable concepts from version-specific implementation details."

### Q138. How would you manage a capstone project within four weeks?

I would divide it into weekly milestones.

| Week | Deliverable |
| --- | --- |
| 1 | Requirements, wireframes, data model and API design |
| 2 | Core React UI, backend endpoints and database integration |
| 3 | Validation, authentication, testing and optional GenAI feature |
| 4 | Bug fixes, deployment, documentation and individual demonstrations |

I would establish a minimum viable project first so that students finish a functional application
before adding optional features.

> **This repo already gives you the Week 2 deliverable.** A student who can rebuild this app from
> `RECREATE.md` has completed the core MERN milestone — use it as the starting point for their
> capstone rather than an empty folder.

### Q139. What if a student asks a question you cannot answer immediately?

"I would acknowledge the question, clarify what is being asked and explain any relevant concepts I
know confidently. I would verify the uncertain part using reliable documentation or a small
experiment and return with a tested answer. I would rather model sound technical investigation than
provide an unsupported answer."

### Q140. Why should we hire you?

"My focus would be on helping students progress from programming fundamentals to a working
full-stack application. I would combine structured explanations, live coding, debugging practice and
measurable exercises. I would also connect GenAI use cases to practical projects while emphasizing
verification, security and responsible use."

This answer is strongest when followed by a concrete example of your teaching or project work.

---

# Part 14 — Additional practical questions

### Q141. How would you build a complete student-management application?

I would implement the following minimum features:

- Create a student.
- Display and search students.
- Update student details.
- Delete a student.
- Validate form data.
- Display loading and error states.
- Store records in MongoDB through Express.
- Add authentication and authorization if the application requires user accounts.

The core data flow is:

```
React form
  |
  | POST /api/students
  v
Express route
  |
  | Validate input
  v
Mongoose model
  |
  v
MongoDB
  |
  | Return created document
  v
React updates the UI
```

I would start with the basic CRUD workflow and introduce authentication only after students
understand the full data flow.

> This diagram is the same shape as the Todo app in this repository — `POST /todo` instead of
> `POST /api/students`. Draw it from memory in the interview.

### Q142. How would you implement JWT authentication in a project?

I would create registration and login endpoints, hash passwords securely, verify credentials at
login, issue short-lived signed access tokens and verify those tokens on protected routes.

I would also consider refresh-token handling, token revocation where needed, secure storage, HTTPS,
rate limiting and authorization checks. I would not store sensitive information in the token payload
or treat possession of a token as proof of resource ownership.

### Q143. How would you add an AI chatbot to an existing MERN application?

I would add a chat interface in React and a protected Express endpoint that calls the configured LLM
provider. I would keep the API key on the backend, validate user input, enforce usage limits and
handle provider errors.

If conversation history is required, I would store it with user ownership in MongoDB. If answers must
be grounded in course material, I would add a RAG retrieval pipeline rather than relying solely on
the model's general knowledge.

### Q144. How would you choose between a direct LLM call and RAG?

Use a direct LLM call when the task can be completed from the supplied prompt and general model
capability, such as rewriting a paragraph.

Use RAG when the answer depends on a particular knowledge base, such as the college's current
academic policies. RAG adds retrieval complexity, so it should be justified by the need for grounded
external information.

### Q145. How would you prevent abuse of a public AI endpoint?

I would require appropriate authentication, validate inputs, enforce request and token quotas, limit
concurrency, set timeouts, monitor usage and apply provider-side spending controls where available.

For public-facing systems, I would also assess automated abuse, repeated prompt attacks and whether
requests need additional moderation or human review.

### Q146. How would you evaluate an AI quiz generator?

I would create a test set covering different topics, difficulty levels and question types. I would
evaluate factual correctness, answer-key correctness, ambiguity, syllabus alignment, format
compliance and latency.

For an educational application, I would have a subject-matter expert review a representative sample
before using generated questions in formal assessments.

---

# Part 15 — Final coding exercises and model answers

### Q147. Reverse a string without using `reverse()`

```javascript
function reverseString(text) {
  let result = "";

  for (let i = text.length - 1; i >= 0; i--) {
    result += text[i];
  }

  return result;
}

console.log(reverseString("MERN")); // NREM
```

Start at the last character and append characters until reaching the first. Suitable for basic ASCII
strings; Unicode grapheme clusters need more careful handling.

### Q148. Sort students by marks

```javascript
const students = [
  { name: "Ravi", marks: 75 },
  { name: "Anu", marks: 90 },
  { name: "Kiran", marks: 82 }
];

const sorted = [...students].sort(
  (a, b) => b.marks - a.marks
);

console.log(sorted);
```

The comparator sorts in descending order. The spread operator creates a shallow copy so the original
array is not sorted in place.

### Q149. Use `map()` to transform student records

```javascript
const students = [
  { name: "Ravi", marks: 75 },
  { name: "Anu", marks: 90 }
];

const results = students.map(student => ({
  name: student.name,
  result: student.marks >= 40 ? "Pass" : "Fail"
}));

console.log(results);
```

Expected result:

```json
[
  { "name": "Ravi", "result": "Pass" },
  { "name": "Anu", "result": "Pass" }
]
```

This demonstrates array transformation, object creation and conditional expressions.

### Q150. Fetch and display students in React

```javascript
import { useEffect, useState } from "react";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/students");

        if (!response.ok) {
          throw new Error("Failed to load students");
        }

        setStudents(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {students.map(student => (
        <li key={student._id}>{student.name}</li>
      ))}
    </ul>
  );
}

export default StudentList;
```

In production you would also consider request cancellation, authentication, retry behaviour and
refreshing the list after creating or updating a student.

> **This is the pattern your `App.jsx` should grow into.** `RECREATE.md` → Part 3.2 keeps it
> deliberately simple (no loading/error states) so beginners can see the happy path first. Adding
> `loading` and `error` state to the todo app is the perfect Module-2 extension exercise.

### Q151. How do you implement a protected Express route?

```javascript
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

app.get("/api/profile", authenticate, (req, res) => {
  res.json({ userId: req.user.sub });
});
```

The token must be issued securely with an appropriate subject claim, expiry and signing
configuration. A separate authorization check is needed for roles and ownership of individual
records.

### Q152. How would you build a basic React chatbot?

The minimum version needs a message list, an input field, a submit handler and a backend API call.

```javascript
import { useState } from "react";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI(event) {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error("Unable to get an answer");
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={askAI}>
      <input
        value={question}
        onChange={event => setQuestion(event.target.value)}
        placeholder="Ask a question"
      />
      <button disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>
      {answer && <p>{answer}</p>}
    </form>
  );
}

export default Chatbot;
```

The frontend assumes the backend returns `{ "answer": "..." }`. The Express endpoint must call the
actual model provider; the provider API key must never be placed in this component.

### Q153. How would you test these coding exercises during an interview?

For each program, test three cases:

1. **Normal input:** a typical valid example.
2. **Boundary input:** an empty array, empty string or minimum allowed value.
3. **Invalid input:** a missing field or incorrect data type, where relevant.

For the React examples, also test API failure, loading behaviour and repeated submissions. For the
AI examples, test malformed model output, rate limits and timeout behaviour.

---

# Part 16 — How to use this pack

### The revision checklist from the source

**JavaScript and React**
- [ ] Explain closures, promises and async/await.
- [ ] Write map, filter, reduce and sorting examples.
- [ ] Explain props, state, useState and useEffect.
- [ ] Build a controlled form and fetch API data.

**Backend and database**
- [ ] Build Express CRUD routes.
- [ ] Explain middleware, HTTP status codes and CORS.
- [ ] Define a Mongoose schema and validate input.
- [ ] Explain authentication, authorization and JWT security.

**Generative AI**
- [ ] Explain LLMs, tokens, hallucinations and prompting.
- [ ] Explain RAG, embeddings, chunking and vector search.
- [ ] Integrate an LLM through a secure Express endpoint.
- [ ] Explain AI evaluation, privacy, cost and prompt injection.

**Teaching and HR**
- [ ] Prepare a 10-minute React teaching demonstration.
- [ ] Prepare a 10-minute GenAI teaching demonstration.
- [ ] Explain a project from UI through database.
- [ ] Practise classroom management and HR answers.

### The source's own final recommendation

> Prioritize building and explaining **one complete MERN CRUD application**, **one secure
> LLM-powered chatbot**, and **one RAG-based college document assistant**. These three
> demonstrations cover a large proportion of the technical and teaching skills likely to be tested
> for a combined MERN Stack and GenAI trainer role.

You already have the first of the three: **this repository** is a complete MERN CRUD application
with a documented build guide. Build the chatbot and the RAG assistant on top of it.

### Turn each answer into your own

1. **Read** the answer, then close the document.
2. **Explain it out loud** to a colleague in under two minutes.
3. **Write a 10-line version** from memory.
4. **Change one detail** and predict what breaks.
5. **Personalise** any teaching or HR answer with your real experience — an interview panel can tell
   a rehearsed answer from a lived one instantly.

### Live demo scripts to have ready

| Demo | Length | What you show |
| ---- | ------ | ------------- |
| **React 10-minute demo** | 10 min | A counter → why a plain variable does not re-render → `useState` → `useEffect` fetching from your Express API → ask the class to predict the output first |
| **GenAI 10-minute demo** | 10 min | A vague prompt → the same prompt with role, context, constraints and output format → have students verify the output instead of trusting it |
| **Full-stack demo** | 15 min | The todo app: add a todo in the browser, then show the exact request in the Network tab, the route in `routes.js`, the handler in `controller.js`, the schema in `Todo.js`, and the document in MongoDB Compass |

### Five stories worth telling in the interview

All five come straight from this project and all five demonstrate real debugging:

1. **The silent 500.** `getAllTodo` queried the database correctly but sent
   `{message: "Retrieved all notes from database"}` instead of the todos. `curl` returned a
   success message and the browser rendered a permanently empty list. The lesson: *a 200 response
   is not the same as a useful response.*
2. **The `.env` that did nothing.** The project had a `.env` file with the connection string, and a
   `config.js` that ignored it and hardcoded the URI instead — with a double slash that named the
   database `/todo`. The lesson: *configuration that is not actually read is a lie.*
3. **The edit that deleted data.** The Edit button used `window.prompt`, which returns one string,
   so only the note could ever be edited. The PUT then sent the *add form's* `content` value — so
   saving an edit silently wiped the todo's content. Nothing errored; the note updated and the
   content vanished. The lesson: *a form that edits one field is not a form that edits the
   record*, and *a request that returns 200 can still destroy data.* This is the strongest
   debugging story of the four, because the bug was invisible — it had to be found by reading the
   code and reasoning about which state variable was being sent.
4. **The build that only failed on Windows.** The frontend used Vite's SWC plugin, a native Rust
   binary. On the trainer's machine `npm run build` died with `Failed to load native binding`, and
   the cause turned out to be a cache-permission check that walks up to `C:\` and rejects the
   standard AppContainer SID — unfixable from the project side. The fix was to swap the plugin for
   the pure-JavaScript one. The lesson: *a build tool that needs a platform-specific binary is a
   support ticket waiting to happen*, and *the right fix is often to remove the dependency rather
   than force it to work.* This is also the story to tell when a student asks why a tool that
   works on your laptop fails on theirs.
5. **The DNS that worked in the browser and failed in the app.** After switching the connection
   string to a MongoDB Atlas SRV URL, the driver failed with
   `querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net` — on a cluster that was perfectly
   healthy. `nslookup` resolved the very same name, the browser resolved it, and the server still
   could not. The cause: Node's DNS client (c-ares) and the Windows DNS client are **different
   resolvers**. On that machine, Windows Internet Connection Sharing owned `127.0.0.1:53` and closed
   every query it was sent, and Node was pointed at `127.0.0.1` — while everything else on the
   machine asked the real nameservers. The fix was `dns.setServers()` with the real resolver
   addresses. The lesson: *when the evidence contradicts itself, do not pick a side — find the layer
   where the two observations disagree.* It is also the cleanest example of the debugging method
   interviewers probe: form a hypothesis, name the layer, test with the smallest possible command.

---

*Transcribed and reorganised from the supplied 49-page PDF "MERN GenAI Interview Questions".
Cross-referenced to `RECREATE.md` and the BCA-V MERN Stack Development syllabus (7 modules / 30 h).*

