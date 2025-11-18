import { MarkdownRenderer } from "@/components/markdown-renderer";

const sampleMarkdown = `
# Markdown & KaTeX テスト

これはMarkdownのテストです。

## リスト
* アイテム1
* アイテム2

## コードブロック
\`\`\`typescript
const a = 1;
const b = 2;
const sum = a + b;
\`\`\`

## インライン数式
インライン数式 $E=mc^2$ は重要です。

## ブロック数式
ブロック数式は以下のように表示されます。

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

また、二次方程式の解の公式は $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ です。
`;

export default function TestMarkdownPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Markdown/KaTeX レンダリングテストページ</h1>
        <div className="border p-6 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-900">
          <MarkdownRenderer content={sampleMarkdown} />
        </div>
      </div>
    </div>
  );
}
