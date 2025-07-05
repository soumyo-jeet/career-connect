import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Bot, HeartPulse, VerifiedIcon } from 'lucide-react'
import React from 'react'

function ResumeInsightCard({ insight }) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="h-5 w-5 text-blue-900" />
                    AI Analysis
                </CardTitle>
                <CardDescription>
                    Automated evaluation of this application
                </CardDescription>
            </CardHeader>
            {
                insight && (
                    <CardContent className="grid gap-6">
                        <h4 className="font-medium mb-2">
                            Match Score:
                            <span className='text-green-500'> {insight.match} </span>/100
                        </h4>

                        <div className="space-y-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex gap-2 mb-3">
                                    <VerifiedIcon className="h-8 w-8 text-green-500" />
                                    <h3 className="font-semibold text-green-500">Strengths:</h3>
                                    <ul className="space-y-2">
                                        {insight.strengths?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-green-500">•</span>
                                                <span className="text-green-500">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="flex gap-2 mb-3">
                                    <AlertCircle className="h-8 w-8 text-red-500" />
                                    <h3 className="font-semibold text-red-500">Considerations:</h3>
                                    <ul className="space-y-2">
                                        {insight.weaknesses?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-red-500">•</span>
                                                <span className="text-red-500">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p className="text-sm italic text-yellow-700">
                                <span className="font-medium">Recommendation: </span>
                                {insight.tips}
                            </p>
                        </div>
                    </CardContent>
                )
            }
        </Card>
    )
}

export default ResumeInsightCard