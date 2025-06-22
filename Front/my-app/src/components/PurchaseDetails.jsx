import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, DownloadCloud, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function PurchaseDetails() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [compraInfo, setCompraInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/produtos-compras/compra/${id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        if (data.length > 0) setCompraInfo(data[0].compra);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleEmitNF = () => {
    fetch(`http://localhost:8080/api/compras/${id}/emitir-nota-fiscal`)
      .then(res => res.text())
      .then(xmlText => {
        const xmlBlob = new Blob([xmlText], { type: 'application/xml' });
        const xmlUrl = URL.createObjectURL(xmlBlob);
        const aXml = document.createElement('a');
        aXml.href = xmlUrl;
        aXml.download = `nota_fiscal_${id}.xml`;
        document.body.appendChild(aXml);
        aXml.click();
        aXml.remove();
        URL.revokeObjectURL(xmlUrl);

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'application/xml');
        const nf = xml.querySelector('NotaFiscal');
        const clienteElem = nf.querySelector('Cliente');
        const produtos = Array.from(xml.querySelectorAll('Produtos > Produto')).map(pr => ({
          descricao: pr.querySelector('Descricao')?.textContent,
          quantidade: Number(pr.querySelector('Quantidade')?.textContent),
          valorUnitario: parseFloat(pr.querySelector('ValorUnitario')?.textContent),
          valorTotal: parseFloat(pr.querySelector('ValorTotal')?.textContent)
        }));
        setInvoiceData({
          codigo: nf.querySelector('CodigoNF')?.textContent,
          origem: nf.querySelector('OrigemCompra')?.textContent,
          dataEmissao: nf.querySelector('DataEmissao')?.textContent,
          valorTotal: parseFloat(nf.querySelector('ValorTotal')?.textContent),
          cliente: { id: clienteElem.getAttribute('id'), nome: clienteElem.textContent },
          produtos
        });
      })
      .catch(err => console.error(err));
  };

  const handleDownloadStyledPDF = () => {
    if (!invoiceRef.current) return;
    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: [10, 10, 10, 10],
        filename: `Danfe_Compra_${id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      })
      .save();
  };

  if (loading) return <p className="text-center mt-10">Carregando detalhes...</p>;
  if (!compraInfo) return <p className="text-center mt-10">Compra não encontrada</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/compras" className="inline-flex items-center text-gray-700 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
          </Link>
          <button
            onClick={handleEmitNF}
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            <DownloadCloud className="w-5 h-5 mr-2" /> XML NF
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-2">Compra #{compraInfo.id}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
            <div><span className="font-semibold">Data:</span> {new Date(compraInfo.dataCompra).toLocaleDateString('pt-BR')}</div>
            <div><span className="font-semibold">Cliente:</span> {compraInfo.cliente.nome}</div>
            <div><span className="font-semibold">Total:</span> R$ {compraInfo.valorTotalcompra.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Produto</th>
                <th className="px-4 py-2 border">Qtde</th>
                <th className="px-4 py-2 border">Valor Unit.</th>
                <th className="px-4 py-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {items.map(item => {
                const subtotal = item.quantidade * item.precoUnitario;
                return (
                  <tr key={item.id} className="odd:bg-gray-50">
                    <td className="px-4 py-2 border">{item.nomeProduto}</td>
                    <td className="px-4 py-2 border text-right">{item.quantidade}</td>
                    <td className="px-4 py-2 border text-right">R$ {item.precoUnitario.toFixed(2)}</td>
                    <td className="px-4 py-2 border text-right">R$ {subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {invoiceData && (
          <div className="bg-white p-6 rounded-lg shadow-md" ref={invoiceRef}>
            {/* DANFE Style Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <div className="flex-1">
                <h2 className="text-xl font-bold">DANFE - Documento Auxiliar de NFe</h2>
                <p className="text-sm text-gray-600">Série 000 | NF-e Nº {invoiceData.codigo}</p>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-semibold">Emitida em:</span>
                <span>{new Date(invoiceData.dataEmissao).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            {/* Info Cliente / Origem */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-gray-700">
              <div>
                <p className="font-semibold">Emitente:</p>
                <p>Sistema Compras LTDA.</p>
                <p>CNPJ: 00.000.000/0000-00</p>
              </div>
              <div>
                <p className="font-semibold">Destinatário:</p>
                <p>{invoiceData.cliente.nome}</p>
                <p>CPF: {invoiceData.cliente.id}</p>
              </div>
            </div>
            {/* Products Section */}
            <div className="mb-4">
              <table className="w-full border-collapse text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-left">Código</th>
                    <th className="border px-2 py-1 text-left">Descrição</th>
                    <th className="border px-2 py-1 text-right">Qtde</th>
                    <th className="border px-2 py-1 text-right">Vlr Unit.</th>
                    <th className="border px-2 py-1 text-right">Vlr Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.produtos.map((p, idx) => (
                    <tr key={idx} className="odd:bg-gray-50">
                      <td className="border px-2 py-1">{idx + 1}</td>
                      <td className="border px-2 py-1">{p.descricao}</td>
                      <td className="border px-2 py-1 text-right">{p.quantidade}</td>
                      <td className="border px-2 py-1 text-right">R$ {p.valorUnitario.toFixed(2)}</td>
                      <td className="border px-2 py-1 text-right">R$ {p.valorTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Totals Footer */}
            <div className="flex justify-end text-gray-700">
              <div className="w-1/3">
                <div className="flex justify-between">
                  <span className="font-semibold">Valor Total NF:</span>
                  <span>R$ {invoiceData.valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {invoiceData && (
          <button
            onClick={handleDownloadStyledPDF}
            className="w-full mt-4 inline-flex justify-center items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <FileText className="w-5 h-5 mr-2" /> Baixar DANFE (PDF)
          </button>
        )}
      </div>
    </div>
  );
}
