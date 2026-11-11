import React, { Suspense, use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

function UserProfile({ params }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h1>Profile Page</h1>
        <p className="text-4xl">
          This is the profile page content. {use(params).id}
        </p>
      </div>
    </Suspense>
  );
}

export default UserProfile;
