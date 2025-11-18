import { auth } from "@/auth";
import { SignInButton, SignOutButton, UserInfo } from "@/components/auth-buttons";
import { Card } from "@repo/ui/card";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">MedStudy SRS - 認証テスト</h1>
      <Card className="w-full max-w-md p-6 space-y-6">
        <UserInfo />
        <div className="flex justify-center space-x-4">
          {session ? <SignOutButton /> : <SignInButton />}
        </div>
        {session && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm break-all">
            <h2 className="font-semibold mb-2">セッション情報 (JSON)</h2>
            <pre className="whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
          </div>
        )}
      </Card>
    </div>
  );
}
