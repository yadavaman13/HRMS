import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import { Award, Briefcase, Code, Heart } from 'lucide-react';
import './ProfileTabs.scss';

export default function ResumeTab({ profile }) {
    const skills = Array.isArray(profile?.skills) ? profile.skills : [];
    const certs = Array.isArray(profile?.certifications) ? profile.certifications : [];
    const experiences = Array.isArray(profile?.experiences) ? profile.experiences : [];
    const interests = Array.isArray(profile?.interests) ? profile.interests : [];

    return (
        <div className="profile-tab-content">
            <div className="profile-section-card">
                <div className="profile-section-card__header">
                    <Briefcase size={18} className="profile-section-card__icon" />
                    <h4 className="profile-section-card__title">About & Summary</h4>
                </div>
                <p className="profile-section-card__text">
                    {profile?.about || 'No professional summary added yet.'}
                </p>
                {profile?.whatILoveAboutJob && (
                    <div className="profile-section-card__subblock">
                        <h5 className="profile-section-card__subtitle">
                            <Heart size={14} className="icon-pink" /> What I love about my job
                        </h5>
                        <p className="profile-section-card__text">{profile.whatILoveAboutJob}</p>
                    </div>
                )}
            </div>

            <div className="profile-section-card">
                <div className="profile-section-card__header">
                    <Code size={18} className="profile-section-card__icon" />
                    <h4 className="profile-section-card__title">Skills & Technologies</h4>
                </div>
                {skills.length > 0 ? (
                    <div className="profile-tags-wrap">
                        {skills.map((skill, index) => (
                            <Badge
                                key={typeof skill === 'string' ? skill : index}
                                variant="primary"
                                size="md"
                            >
                                {typeof skill === 'string' ? skill : skill?.name || 'Skill'}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="profile-section-card__empty">No skills listed.</p>
                )}
            </div>

            <div className="profile-section-card">
                <div className="profile-section-card__header">
                    <Award size={18} className="profile-section-card__icon" />
                    <h4 className="profile-section-card__title">Certifications & Licenses</h4>
                </div>
                {certs.length > 0 ? (
                    <div className="profile-list-wrap">
                        {certs.map((cert, index) => (
                            <div key={cert?.id || index} className="profile-list-item">
                                <span className="profile-list-item__title">
                                    {cert?.name || cert}
                                </span>
                                {cert?.issuer && (
                                    <span className="profile-list-item__meta">
                                        {cert.issuer} • {cert.year}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="profile-section-card__empty">No certifications attached.</p>
                )}
            </div>
        </div>
    );
}
