<?php

namespace App\Service;

use App\Entity\ClaimUser\Payment;
use Doctrine\ORM\EntityManagerInterface;
use Dompdf\Dompdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Twig\Environment;

/**
 * Class BookingFormService
 * @package App\Service
 */
class PayementService
{
    /**
	 * @param EntityManagerInterface $entityManager
     * @param Environment $twig
	 */
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Environment $twig
    )
    {
    }

    /**
     * Génération détail PDF
     * @param Payment $payement
     * @return void
     */
    public function generatePdf($payments)
    {
        $pdfOptions = new \Dompdf\Options();
        $pdfOptions->set('defaultFont', 'Arial')->setIsRemoteEnabled(true);
        $pdfOptions->set("isPhpEnabled", true);
        $pdf = new Dompdf($pdfOptions);
        
        $template = $this->twig->render("payement/pdf.html.twig", [
            'payement' => $payments
        ]);

        $pdf->loadHtml($template);
        $pdf->setPaper('A4', 'portrait');
        $pdf->render();

        $date           = (new \DateTime())->format('d_m_Y_H_i_s');
        $filename       = "payments_" . $date . ".pdf";
        $pdf->stream($filename, ["Attachment" => true]);
        exit();
    }


    /**
     * Génération détail Excel
     * @param  Payment $payementBookingForm $bookingForm
     * @return array
     */
    public function generateExcel($payements)
    {
        // Création d'un nouveau spreadsheet
        $spreadsheet    = new Spreadsheet();
        $sheet          = $spreadsheet->getActiveSheet();

        // En-têtes des colonnes
        $sheet->setCellValue('A1', 'Date Submitted');
        $sheet->setCellValue('B1', 'Invoice No');
        $sheet->setCellValue('C1', 'Claim No');
        $sheet->setCellValue('D1', 'Claim Amount(MUR)');
        $sheet->setCellValue('E1', 'Payment Date');
        $sheet->setCellValue('F1', 'Status');

        // Remplissage des données
        $row = 2; // Commence à la ligne 2 (après les en-têtes)
        foreach ($payements as $payment) {
            $sheet->setCellValue('A'.$row, $payment['date_submitted'] ?? '');
            $sheet->setCellValue('B'.$row, $payment['invoice_no'] ?? '');
            $sheet->setCellValue('C'.$row, $payment['claim_number'] ?? '');
            $sheet->setCellValue('D'.$row, $payment['claim_amount'] ?? '');
            $sheet->setCellValue('E'.$row, $payment['date_payment'] ?? '');
            $sheet->setCellValue('F'.$row, $payment['status_name'] ?? '');
            $row++;
        }

        // Style des en-têtes
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => 'SOLIDE',
                'color' => ['rgb' => '4472C4']
            ]
        ];
        // $sheet->getStyle('A1')->applyFromArray($headerStyle);

        // Auto-ajustement des colonnes
        foreach (range('A', 'F') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Création du writer
        $writer = new Xlsx($spreadsheet);

        // Génération du nom de fichier
        $date = (new \DateTime())->format('d_m_Y_H_i_s');
        $filename = "payments_" . $date . ".xlsx";

        $response = new StreamedResponse(function() use ($writer) {
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename="'.$filename.'"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    /**
     * Génération détail csv
     * @param  Payment $payementBookingForm $bookingForm
     * @return array
     */
    public function generateCsv(array $payments): StreamedResponse
    {
        $response = new StreamedResponse(function () use ($payments) {
            $handle = fopen('php://output', 'w');

            // En-têtes CSV
            fputcsv($handle, [
                'Date Submitted',
                'Invoice No',
                'Claim No',
                'Claim Amount (MUR)',
                'Payment Date',
                'Status'
            ]);

            // Données
            foreach ($payments as $payment) {
                fputcsv($handle, [
                    $payment['date_submitted'] ?? '',
                    $payment['invoice_no'] ?? '',
                    $payment['claim_number'] ?? '',
                    $payment['claim_amount'] ?? '',
                    $payment['date_payment'] ?? '',
                    $payment['status_name'] ?? ''
                ]);
            }

            fclose($handle);
        });

        $date = (new \DateTime())->format('d_m_Y_H_i_s');
        $filename = "payments_" . $date . ".csv";

        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $response->headers->set('Content-Disposition', 'attachment; filename="'.$filename.'"');
        $response->headers->set('Cache-Control', 'no-store, no-cache');

        return $response;
    }

    /**
     * Génération détail facture d'un paiement en PDF
     * 
     * @return void
     */
    public function generatePdfDetailsInvoice($invoices)
    {
        $pdfOptions = new \Dompdf\Options();
        $pdfOptions->set('defaultFont', 'Arial')->setIsRemoteEnabled(true);
        $pdfOptions->set("isPhpEnabled", true);
        $pdf = new Dompdf($pdfOptions);
        
        $template = $this->twig->render("payement/pdf-invoice.html.twig", [
            'invoices' => $invoices
        ]);

        $pdf->loadHtml($template);
        $pdf->setPaper('A4', 'portrait');
        $pdf->render();

        $date           = (new \DateTime())->format('d_m_Y_H_i_s');
        $filename       = "payments_invoice_details_" . $date . ".pdf";
        $pdf->stream($filename, ["Attachment" => true]);
        exit();
    }

}