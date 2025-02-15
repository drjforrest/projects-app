import ReactMarkdown from 'react-markdown';
import { ProjectRetrospective } from '@/types/feedback';
import { formatDate } from '@/utils/dateTime';

interface ProjectRetrospectiveViewProps {
    retrospective: ProjectRetrospective;
}

export const ProjectRetrospectiveView: React.FC<ProjectRetrospectiveViewProps> = ({ 
    retrospective 
}) => {
    return (
        <div className="space-y-8">
            <div className="border-b pb-4">
                <h3 className="text-lg font-semibold">Project Retrospective</h3>
                <p className="text-sm text-gray-500">
                    Completed on {formatDate(retrospective.completionDate)}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <h4 className="font-medium mb-2">Success Metrics</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Timeline Adherence</span>
                            <span className="font-medium">{retrospective.successMetrics.timelineAdherence}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Quality Score</span>
                            <span className="font-medium">{retrospective.successMetrics.qualityScore}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Learning Value</span>
                            <span className="font-medium">{retrospective.successMetrics.learningValue}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="prose max-w-none">
                <div className="mb-8">
                    <h4 className="text-lg font-medium mb-4">Key Achievements</h4>
                    <ReactMarkdown>{retrospective.keyAchievements}</ReactMarkdown>
                </div>

                <div className="mb-8">
                    <h4 className="text-lg font-medium mb-4">Challenges Faced</h4>
                    <ReactMarkdown>{retrospective.challengesFaced}</ReactMarkdown>
                </div>

                <div className="mb-8">
                    <h4 className="text-lg font-medium mb-4">Lessons Learned</h4>
                    <ReactMarkdown>{retrospective.lessonsLearned}</ReactMarkdown>
                </div>

                <div className="mb-8">
                    <h4 className="text-lg font-medium mb-4">Improvements for Next Time</h4>
                    <ReactMarkdown>{retrospective.improvements}</ReactMarkdown>
                </div>

                {retrospective.kudos.length > 0 && (
                    <div>
                        <h4 className="text-lg font-medium mb-4">Kudos</h4>
                        <ul className="list-disc pl-5">
                            {retrospective.kudos.map((kudo, index) => (
                                <li key={index}>{kudo}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}; 