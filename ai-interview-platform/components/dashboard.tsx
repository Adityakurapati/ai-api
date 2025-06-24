"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Sparkles, RefreshCw, Eye, Edit, Share2, Instagram, Globe, Download, Send } from "lucide-react"

interface DashboardProps {
  interviewData: any
  onBack: () => void
}

export default function Dashboard({ interviewData, onBack }: DashboardProps) {
  const [keyPoints, setKeyPoints] = useState([
    {
      id: 1,
      text: "Software engineer specializing in AI and machine learning",
      confidence: 95,
      category: "Professional Background",
    },
    {
      id: 2,
      text: "Led development of AI-powered customer service chatbot",
      confidence: 92,
      category: "Recent Achievement",
    },
    {
      id: 3,
      text: "60% reduction in response times and improved customer satisfaction",
      confidence: 88,
      category: "Impact Metrics",
    },
    {
      id: 4,
      text: "Overcame legacy system integration challenges",
      confidence: 85,
      category: "Problem Solving",
    },
    {
      id: 5,
      text: "Future focus on AI in healthcare and education",
      confidence: 90,
      category: "Future Goals",
    },
  ])

  const [article, setArticle] = useState(`# Meet Sarah Johnson: The AI Engineer Transforming Customer Service

Sarah Johnson is a software engineer who specializes in artificial intelligence and machine learning. Her journey into tech began during college when a computer science course opened her eyes to technology's potential for solving real-world problems.

## Recent Breakthrough

Sarah recently led the development of an AI-powered customer service chatbot that has revolutionized her company's customer support operations. The results speak for themselves:

- **60% reduction** in response times
- **Significant improvement** in customer satisfaction scores
- **Seamless integration** with existing systems

## Overcoming Challenges

One of the biggest hurdles Sarah faced was integrating legacy systems with cutting-edge AI technologies. Her solution? Creating a robust API layer and conducting extensive testing to ensure reliability and performance.

## Looking Ahead

Sarah's vision extends beyond current projects. She's excited about the future of AI in healthcare and education, planning to transition into AI research focused on these critical areas within the next two years.

## Words of Wisdom

For those just starting in the field, Sarah's advice is simple but powerful: "Never stop learning and don't be afraid to take on challenging projects. The field moves fast, but that's what makes it exciting!"

---

*This article was generated from an AI-powered interview session.*`)

  const [publishSettings, setPublishSettings] = useState({
    format: "website",
    includeImages: true,
    autoCaption: true,
    platforms: {
      website: true,
      instagram: false,
    },
  })

  const regenerateKeyPoint = (id: number) => {
    setKeyPoints((prev) =>
      prev.map((point) =>
        point.id === id ? { ...point, confidence: Math.min(100, point.confidence + Math.random() * 10) } : point,
      ),
    )
  }

  const handlePublish = () => {
    // Simulate publishing process
    setTimeout(() => {
      alert(
        "🎉 Content published successfully!\n\n📱 WhatsApp: Your article is now live! Check it out:\n\n🌐 Website: https://yoursite.com/articles/sarah-johnson-ai-engineer\n📱 Instagram: https://instagram.com/p/abc123",
      )
    }, 2000)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Interview
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Article Dashboard</h1>
              <p className="text-white/60">Transform your interview into engaging content</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-600 text-white">
            Interview Complete
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="keypoints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="keypoints" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Key Points
            </TabsTrigger>
            <TabsTrigger value="editor" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Article Editor
            </TabsTrigger>
            <TabsTrigger value="publish" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Publishing
            </TabsTrigger>
          </TabsList>

          {/* Key Points Tab */}
          <TabsContent value="keypoints" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Extracted Key Points</h2>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate More
                </Button>
              </div>

              <div className="grid gap-4">
                {keyPoints.map((point) => (
                  <Card key={point.id} className="bg-white/5 border-white/10 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {point.category}
                          </Badge>
                          <Badge
                            variant={
                              point.confidence >= 90 ? "default" : point.confidence >= 80 ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {point.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-white leading-relaxed">{point.text}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => regenerateKeyPoint(point.id)}
                          className="text-white/60 hover:text-white"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Editor */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Rich Text Editor</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Enhance
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  className="min-h-[500px] bg-slate-800 text-white border-white/20 resize-none font-mono text-sm"
                  placeholder="Start writing your article..."
                />
              </Card>

              {/* Preview */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Live Preview</h2>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Full Screen
                  </Button>
                </div>
                <div className="bg-white rounded-lg p-6 min-h-[500px] overflow-y-auto">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: article
                        .replace(/\n/g, "<br>")
                        .replace(/# (.*)/g, "<h1>$1</h1>")
                        .replace(/## (.*)/g, "<h2>$1</h2>"),
                    }}
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Publishing Tab */}
          <TabsContent value="publish" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Publishing Settings */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Publishing Settings</h2>

                <div className="space-y-6">
                  <div>
                    <Label className="text-white mb-3 block">Output Format</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={publishSettings.format === "website" ? "default" : "outline"}
                        onClick={() => setPublishSettings((prev) => ({ ...prev, format: "website" }))}
                        className="justify-start"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Website Article
                      </Button>
                      <Button
                        variant={publishSettings.format === "instagram" ? "default" : "outline"}
                        onClick={() => setPublishSettings((prev) => ({ ...prev, format: "instagram" }))}
                        className="justify-start"
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram Carousel
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Include AI-generated images</Label>
                      <Switch
                        checked={publishSettings.includeImages}
                        onCheckedChange={(checked) =>
                          setPublishSettings((prev) => ({ ...prev, includeImages: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">Auto-generate captions</Label>
                      <Switch
                        checked={publishSettings.autoCaption}
                        onCheckedChange={(checked) => setPublishSettings((prev) => ({ ...prev, autoCaption: checked }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Custom Caption</Label>
                    <Textarea
                      placeholder="Add a custom caption for social media..."
                      className="bg-slate-800 text-white border-white/20"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>

              {/* Preview and Publish */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Preview & Publish</h2>

                <div className="space-y-4">
                  {publishSettings.format === "website" ? (
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">Website Preview</div>
                      <h3 className="font-bold text-lg mb-2">
                        Meet Sarah Johnson: The AI Engineer Transforming Customer Service
                      </h3>
                      <p className="text-gray-700 text-sm">
                        Sarah Johnson is a software engineer who specializes in artificial intelligence and machine
                        learning...
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg p-4 text-white">
                      <div className="text-sm opacity-80 mb-2">Instagram Carousel Preview</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/20 rounded aspect-square flex items-center justify-center text-xs">
                          Slide 1
                        </div>
                        <div className="bg-white/20 rounded aspect-square flex items-center justify-center text-xs">
                          Slide 2
                        </div>
                        <div className="bg-white/20 rounded aspect-square flex items-center justify-center text-xs">
                          Slide 3
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handlePublish}>
                      <Send className="w-4 h-4 mr-2" />
                      Publish Now
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Draft
                    </Button>
                  </div>

                  <div className="text-sm text-white/60">
                    <p>✅ Content will be published to selected platforms</p>
                    <p>📱 WhatsApp notification will be sent upon completion</p>
                    <p>🔗 Direct links will be provided for easy sharing</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
