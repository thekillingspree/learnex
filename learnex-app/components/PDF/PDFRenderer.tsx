"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import SimpleBar from "simplebar-react";
import PDFToolbar from "./PDFToolbar";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFRendererProps {
  url: string;
}

const PDFRenderer = ({ url }: PDFRendererProps) => {
  const { toast } = useToast();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const { width, ref } = useResizeDetector();

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col items-center shadow rounded-md">
      <PDFToolbar
        pages={totalPages}
        isLoading={loading}
        currentPage={currentPage}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onPageChange={handlePageChange}
        scale={scale}
        onScaleChange={(scale) => setScale(scale)}
      />
      <div className="flex-1 w-full h-full max-h-full flex items-center justify-center">
        <SimpleBar
          autoHide={false}
          className="flex-1 flex items-center justify-center h-full max-h-[calc(100vh-10rem)]"
        >
          <div ref={ref}>
            <Document
              file={url}
              loading={
                <div className="flex justify-center items-center">
                  <div className="animate-spin my-24">
                    <Loader2 size="64" />
                  </div>
                </div>
              }
              onLoadSuccess={({ numPages }) => {
                setTotalPages(numPages);
                setLoading(false);
              }}
              onLoadError={({}) => {
                toast({
                  title: "Error",
                  description: "Failed to load PDF",
                  variant: "destructive",
                });
                setLoading(false);
              }}
              className="max-h-full flex justify-center items-center"
            >
              <Page
                width={width ? width : 1}
                loading={
                  <div className="flex justify-center items-center">
                    <div className="animate-spin my-24">
                      <Loader2 size="64" />
                    </div>
                  </div>
                }
                className="flex-1"
                pageNumber={currentPage}
                scale={scale}
                // canvasBackground="rgba(0, 0, 0, 0)"
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PDFRenderer;
