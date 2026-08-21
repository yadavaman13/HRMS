import Button from '@/components/Shared/Buttons/Button/Button';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import { FileText, Download, Upload } from 'lucide-react';
import './ProfileTabs.scss';

export default function DocumentsTab({ documents = [] }) {
    const docs = Array.isArray(documents) ? documents : [];

    const defaultDocs =
        docs.length > 0
            ? docs
            : [
                  {
                      id: 1,
                      name: 'Signed_Offer_Letter.pdf',
                      size: '245 KB',
                      date: '2026-01-10',
                      category: 'Employment',
                  },
                  {
                      id: 2,
                      name: 'Identity_Verification_Aadhar.pdf',
                      size: '1.2 MB',
                      date: '2026-01-10',
                      category: 'Identification',
                  },
                  {
                      id: 3,
                      name: 'Academic_Degree_Certificate.pdf',
                      size: '890 KB',
                      date: '2026-01-11',
                      category: 'Education',
                  },
              ];

    return (
        <div className="profile-tab-content">
            <div className="profile-section-card">
                <div className="profile-section-card__header profile-section-card__header--between">
                    <div className="flex-center-gap">
                        <FileText size={18} className="profile-section-card__icon" />
                        <h4 className="profile-section-card__title">
                            Employee Document Repository
                        </h4>
                    </div>
                    <Button variant="secondary" size="sm" icon={Upload}>
                        Upload Document
                    </Button>
                </div>

                <div className="profile-doc-list">
                    {(defaultDocs || []).map((doc, idx) => (
                        <div key={doc?.id || idx} className="profile-doc-card">
                            <div className="profile-doc-card__left">
                                <div className="profile-doc-card__icon-box">
                                    <FileText size={20} />
                                </div>
                                <div className="profile-doc-card__info">
                                    <span className="profile-doc-card__name">
                                        {doc?.name || 'Document.pdf'}
                                    </span>
                                    <span className="profile-doc-card__meta">
                                        {doc?.size || 'N/A'} • Uploaded on{' '}
                                        {doc?.date || '2026-01-10'}
                                    </span>
                                </div>
                            </div>
                            <div className="profile-doc-card__right">
                                <Badge variant="neutral" size="sm">
                                    {doc?.category || 'General'}
                                </Badge>
                                <Button variant="ghost" size="sm" icon={Download}>
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
