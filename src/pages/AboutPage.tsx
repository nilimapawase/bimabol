export function AboutPage() {
  return (
    <div className="prose prose-invert max-w-none flex flex-col gap-4 text-lg">
      <h1 className="text-2xl font-bold">About / गोपनीयता</h1>
      <p>
        BimaBol हे सरकारी किंवा विमा कंपनीचे ॲप नाही. डेटा फक्त या फोनवर राहतो —
        login, cloud, GPS, stored audio नाही.
      </p>
      <p>
        नोंद अखंडता तपासणी फक्त या फोनवरील फाइल्सवर काम करते; कायदेशीर पुरावा
        नाही. फोनचे घड्याळ वापरले जाते.
      </p>
      <p>
        Web Speech साठी नेटवर्क लागू शकते. नाही असेल तर टाइप करा — घड्याळ चालू
        राहते.
      </p>
    </div>
  )
}