Goal: Summarize the content of code files in a short, non-redundant manner.

Required Details:

1. Classes: For each class, provide the fully qualified name and a one- or two-sentence summary of its purpose or functionality.
2. Functions: For each function, provide its fully qualified name, signature and a concise description (one line) of what it does or returns.

Constraints:

- Keep the summaries concise.
- Avoid restating the same information.
- If there are no classes or functions, indicate that briefly.
- Do not include code excerpts, just the summary.
- Do not include empty sections, don't write them
- Do not write summaries stating information that's obvious from the name
- Please use fully qualified names for everything. For example in C# use namespace::class::function()
- Only include file references if not in the same file

Example Format:
**File**: full filename with path

**Interfaces**:

- InterfaceName: Short summary (1-4 sentences)

**Classes**:

- ClassName: Short summary (1–4 sentences)

**Functions**:

- functionSignature: Short description (1 line)
  Calls: class class::functions Ref: filepath/filename.ext

**Properties**

- propertySignature: Short description (1 line)

**Events**

- eventSignature: Short desciption (1 line)

**Enums**

- enumSignature: Short description (1 line)
  EnumValue1: Short description (as needed)
  EnumValue2: Short description (as needed)

Output:
Write the file to a file under the path Docs/Source/PathToSourceFile/Filename.md
For example the file src/core/diff/types.ts would be Docs/Source/src/core/diff/types.md
