// src/components/PurchaseDetails.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, DownloadCloud, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function PurchaseDetails() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [compraInfo, setCompraInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/produtos-compras/compra/${id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        if (data.length) setCompraInfo(data[0].compra);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleEmitNF = () => {
    fetch(`http://localhost:8080/api/compras/${id}/emitir-nota-fiscal`)
      .then(res => res.text())
      .then(xmlText => {
        // download XML
        const blob = new Blob([xmlText], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nota_fiscal_${id}.xml`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        // parse invoiceData
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'application/xml');
        const nf = xml.querySelector('NotaFiscal');
        
        const clienteElem = nf.querySelector('Cliente');
        const produtos = Array.from(xml.querySelectorAll('Produtos > Produto')).map(pr => ({
          descricao: pr.querySelector('Descricao')?.textContent,
          quantidade: +pr.querySelector('Quantidade')?.textContent,
          valorUnitario: +pr.querySelector('ValorUnitario')?.textContent,
          valorTotal: +pr.querySelector('ValorTotal')?.textContent,
        }));

        setInvoiceData(
          {
          codigo: nf.querySelector('CodigoNF')?.textContent,
          dataEmissao: nf.querySelector('DataEmissao')?.textContent,
          cliente: {
            id: clienteElem.getAttribute('id'),
            nome: clienteElem.textContent,
          },
          valorTotal: +nf.querySelector('ValorTotal')?.textContent,
          produtos,
        });
      })
      .catch(console.error);
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    // 1) Clone o preview
    const clone = previewRef.current.cloneNode(true);
    // 2) Limpa classes e estilos problemáticos
    [clone, ...clone.querySelectorAll('*')].forEach(el => {
      el.removeAttribute('class');
      el.removeAttribute('style');
    });
    // 3) Aplica estilos inline simples
    clone.style.background = '#fff';
    clone.style.color = '#000';
    clone.style.padding = '20px';
    clone.style.fontFamily = 'Arial, sans-serif';
    // 4) Container off-screen
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '-9999px';
    wrapper.style.left = '-9999px';
    wrapper.style.width = '595px'; // A4 width in pt
    wrapper.style.background = '#fff';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      // 5) Gera canvas
      const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      // 6) Cria PDF
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DANFE_Compra_${id}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Falha ao gerar PDF. Tente novamente.');
    } finally {
      // 7) Limpa DOM
      document.body.removeChild(wrapper);
    }
  };

  if (loading || !compraInfo) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 p-8">
        <p className="text-white text-lg">
          {loading ? 'Carregando detalhes...' : 'Compra não encontrada'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-800 p-8">
      <div className="w-full max-w-3xl space-y-6 text-white">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <Link to="/compras" className="inline-flex items-center cursor-pointer">
            <ArrowLeft className="w-6 h-6 mr-2" /> Voltar
          </Link>
          <button onClick={handleEmitNF} className="inline-flex items-center cursor-pointer">
            <DownloadCloud className="w-5 h-5 mr-2" /> XML NF
          </button>
        </div>

        {/* Resumo da compra */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 space-y-2">
          <h1 className="text-2xl font-extrabold">Compra #{compraInfo.id}</h1>
          <p>Data: {new Date(compraInfo.dataCompra).toLocaleDateString('pt-BR')}</p>
          <p>Cliente: {compraInfo.cliente.nome}</p>
          <p>Total: R$ {compraInfo.valorTotalcompra.toFixed(2)}</p>
        </div>

        {/* Itens da compra */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden">
          <table className="min-w-full table-auto text-white">
            <thead className="bg-white/20">
              <tr>
                <th className="px-4 py-2 text-left">Produto</th>
                <th className="px-4 py-2 text-right">Qtde</th>
                <th className="px-4 py-2 text-right">Valor Unit.</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {items.map(item => {
                const subtotal = item.quantidade * item.precoUnitario;
                return (
                  <tr key={item.id} className="odd:bg-white/5">
                    <td className="px-4 py-2">{item.nomeProduto}</td>
                    <td className="px-4 py-2 text-right">{item.quantidade}</td>
                    <td className="px-4 py-2 text-right">
                      R$ {item.precoUnitario.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      R$ {subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Preview bonitinho apenas para tela */}
        {invoiceData && (
          <div ref={previewRef} className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">DANFE - Auxiliar NF-e</h2>
            <p className="text-white">NF-e Nº {invoiceData.codigo}</p>
            <p className="text-white/80">
              Emitida em: {new Date(invoiceData.dataEmissao).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-white">Destinatário: {invoiceData.cliente.nome}</p>

            <table className="min-w-full table-auto text-white mt-4">
              <thead className="bg-white/20">
                <tr>
                  <th className="px-2 py-1 text-left">#</th>
                  <th className="px-2 py-1 text-left">Descrição</th>
                  <th className="px-2 py-1 text-right">Qtde</th>
                  <th className="px-2 py-1 text-right">Vlr Unit.</th>
                  <th className="px-2 py-1 text-right">Vlr Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {invoiceData.produtos.map((p, i) => (
                  <tr key={i} className="odd:bg-white/5">
                    <td className="px-2 py-1">{i + 1}</td>
                    <td className="px-2 py-1">{p.descricao}</td>
                    <td className="px-2 py-1 text-right">{p.quantidade}</td>
                    <td className="px-2 py-1 text-right">
                      R$ {p.valorUnitario.toFixed(2)}
                    </td>
                    <td className="px-2 py-1 text-right">
                      R$ {p.valorTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Botão PDF */}
        {invoiceData && (
          <button
            onClick={handleDownloadPDF}
            className="w-full inline-flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-lg transition cursor-pointer"
          >
            <FileText className="w-5 h-5 mr-2" /> Baixar DANFE (PDF)
          </button>
        )}
      </div>
    </div>
  );
}
