import SurveyForm from './components/SurveyForm';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center">
          Survey App
        </h1>
        <SurveyForm />
      </div>
    </main>
  )

}
