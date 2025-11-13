import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { Document } from '@/types/models';
import { DocumentStatus, DocumentType } from '@/types/enums';
import { PlusIcon, FileTextIcon, AlertTriangleIcon, TrendingUpIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Hospital Safety Policy 2024',
    description: 'Comprehensive safety guidelines for all hospital staff',
    document_type: DocumentType.POLICY,
    file_path: '/documents/safety-policy-2024.pdf',
    file_size_bytes: 2048576,
    mime_type: 'application/pdf',
    version: 2,
    uploaded_by: 'admin-1',
    uploaded_at: new Date('2024-01-15'),
    status: DocumentStatus.ACTIVE,
    tags: ['safety', 'policy', 'mandatory'],
    view_count: 145,
    download_count: 67,
  },
  {
    id: '2',
    title: 'Patient Admission Form',
    description: 'Standard form for patient admission process',
    document_type: DocumentType.FORM,
    file_path: '/documents/admission-form.pdf',
    file_size_bytes: 512000,
    mime_type: 'application/pdf',
    version: 1,
    uploaded_by: 'admin-1',
    uploaded_at: new Date('2024-02-01'),
    status: DocumentStatus.ACTIVE,
    tags: ['form', 'admission', 'patient'],
    view_count: 234,
    download_count: 189,
  },
  {
    id: '3',
    title: 'Emergency Response Procedure',
    description: 'Step-by-step emergency response protocol',
    document_type: DocumentType.PROCEDURE,
    file_path: '/documents/emergency-response.pdf',
    file_size_bytes: 1536000,
    mime_type: 'application/pdf',
    version: 3,
    uploaded_by: 'admin-1',
    uploaded_at: new Date('2024-01-20'),
    status: DocumentStatus.ACTIVE,
    tags: ['emergency', 'procedure', 'critical'],
    view_count: 98,
    download_count: 45,
    expiry_date: new Date('2024-12-31'),
  },
  {
    id: '4',
    title: 'Q1 2024 Financial Report',
    description: 'Quarterly financial performance report',
    document_type: DocumentType.REPORT,
    file_path: '/documents/q1-2024-report.pdf',
    file_size_bytes: 3072000,
    mime_type: 'application/pdf',
    version: 1,
    uploaded_by: 'accountant-1',
    uploaded_at: new Date('2024-04-05'),
    status: DocumentStatus.ACTIVE,
    tags: ['financial', 'report', 'quarterly'],
    view_count: 56,
    download_count: 23,
  },
  {
    id: '5',
    title: 'Old Infection Control Policy',
    description: 'Archived infection control guidelines',
    document_type: DocumentType.POLICY,
    file_path: '/documents/old-infection-control.pdf',
    file_size_bytes: 1024000,
    mime_type: 'application/pdf',
    version: 1,
    uploaded_by: 'admin-1',
    uploaded_at: new Date('2023-06-15'),
    status: DocumentStatus.ARCHIVED,
    tags: ['infection', 'policy', 'archived'],
    view_count: 312,
    download_count: 145,
  },
  {
    id: '6',
    title: 'Staff Training Certificate Template',
    description: 'Template for staff training completion certificates',
    document_type: DocumentType.CERTIFICATE,
    file_path: '/documents/training-certificate.docx',
    file_size_bytes: 256000,
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    version: 1,
    uploaded_by: 'hr-1',
    uploaded_at: new Date('2024-03-10'),
    status: DocumentStatus.ACTIVE,
    tags: ['certificate', 'training', 'template'],
    view_count: 78,
    download_count: 34,
  },
];

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>();
  const { toast } = useToast();

  const handleUploadDocument = (data: any) => {
    if (selectedDocument) {
      // Update existing document
      setDocuments(
        documents.map((doc) =>
          doc.id === selectedDocument.id
            ? {
                ...doc,
                title: data.title,
                description: data.description,
                document_type: data.document_type,
                tags: data.tags ? data.tags.split(',') : [],
                version: doc.version + 1,
              }
            : doc
        )
      );
      toast({
        title: 'Document Updated',
        description: 'Document information has been updated successfully.',
      });
    } else {
      // Upload new document
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        title: data.title,
        description: data.description,
        document_type: data.document_type,
        file_path: `/documents/${data.file?.name || 'document.pdf'}`,
        file_size_bytes: data.file?.size || 0,
        mime_type: data.file?.type || 'application/pdf',
        version: 1,
        uploaded_by: 'current-user',
        uploaded_at: new Date(),
        status: DocumentStatus.ACTIVE,
        tags: data.tags ? data.tags.split(',') : [],
        view_count: 0,
        download_count: 0,
      };
      setDocuments([newDocument, ...documents]);
      toast({
        title: 'Document Uploaded',
        description: 'Document has been uploaded successfully.',
      });
    }
    setShowUploadDialog(false);
    setSelectedDocument(undefined);
  };

  const handleViewDocument = (doc: Document) => {
    // Increment view count
    setDocuments(
      documents.map((d) =>
        d.id === doc.id ? { ...d, view_count: d.view_count + 1 } : d
      )
    );
    toast({
      title: 'Opening Document',
      description: `Opening ${doc.title}...`,
    });
    // In a real app, this would open the document
  };

  const handleDownloadDocument = (doc: Document) => {
    // Increment download count
    setDocuments(
      documents.map((d) =>
        d.id === doc.id ? { ...d, download_count: d.download_count + 1 } : d
      )
    );
    toast({
      title: 'Downloading Document',
      description: `Downloading ${doc.title}...`,
    });
    // In a real app, this would download the document
  };

  const activeDocuments = documents.filter((d) => d.status === DocumentStatus.ACTIVE);
  const expiringDocuments = documents.filter(
    (d) =>
      d.expiry_date &&
      d.status === DocumentStatus.ACTIVE &&
      new Date(d.expiry_date).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000
  );

  const totalViews = documents.reduce((sum, doc) => sum + doc.view_count, 0);
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.download_count, 0);

  // Calculate storage usage (in MB)
  const storageUsed = documents.reduce((sum, doc) => sum + doc.file_size_bytes, 0) / (1024 * 1024);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">
            Manage hospital documents, policies, and forms
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeDocuments.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUsed.toFixed(1)} MB</div>
            <p className="text-xs text-muted-foreground">
              Avg: {(storageUsed / documents.length).toFixed(1)} MB/doc
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {totalDownloads} downloads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              Within 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <DocumentList
        documents={documents}
        onView={handleViewDocument}
        onDownload={handleDownloadDocument}
      />

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument ? 'Edit Document' : 'Upload New Document'}
            </DialogTitle>
          </DialogHeader>
          <DocumentUpload
            document={selectedDocument}
            onSubmit={handleUploadDocument}
            onCancel={() => {
              setShowUploadDialog(false);
              setSelectedDocument(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
