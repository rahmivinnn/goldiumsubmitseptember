'use client'
import PageLayout from '@/components/PageLayout'
import InteractiveAvatarCreator from '@/components/avatar/InteractiveAvatarCreator'

export default function AvatarPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Create Your GOLDIUM Avatar
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Design your unique digital identity in the GOLDIUM ecosystem. Customize every detail with revolutionary interactive features and mint your avatar as an NFT.
          </p>
        </div>
        <InteractiveAvatarCreator />
      </div>
    </PageLayout>
  )
}
