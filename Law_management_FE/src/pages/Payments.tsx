import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Download, Eye, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Payment } from '../types';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import html2pdf from 'html2pdf.js';

const Payments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed' | 'refunded'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'this_month' | 'last_month' | 'last_3_months'>('this_month');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockPayments: Payment[] = [
      {
        id: '1',
        appointmentId: 'apt1',
        clientId: 'client1',
        lawyerId: 'lawyer1',
        amount: 2500,
        platformFee: 250,
        lawyerAmount: 2250,
        status: 'completed',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN123456789',
        createdAt: new Date(Date.now() - 86400000),
        completedAt: new Date(Date.now() - 86400000 + 300000)
      },
      {
        id: '2',
        appointmentId: 'apt2',
        clientId: 'client2',
        lawyerId: 'lawyer2',
        amount: 3000,
        platformFee: 300,
        lawyerAmount: 2700,
        status: 'pending',
        paymentMethod: 'UPI',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        appointmentId: 'apt3',
        clientId: 'client3',
        lawyerId: 'lawyer1',
        amount: 2000,
        platformFee: 200,
        lawyerAmount: 1800,
        status: 'failed',
        paymentMethod: 'Net Banking',
        createdAt: new Date(Date.now() - 7200000)
      }
    ];

    setPayments(mockPayments);
    setLoading(false);
  };

  useEffect(() => {
    if (showPaymentModal && modalRef.current && selectedPayment) {
      const opt = {
        margin: 0.3,
        filename: `Invoice-${selectedPayment.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      setTimeout(() => {
        html2pdf().set(opt).from(modalRef.current as HTMLElement).save();
      }, 300);
    }
  }, [showPaymentModal, selectedPayment]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter !== 'all' && payment.status !== filter) return false;
    if (dateRange !== 'all') {
      const paymentDate = payment.createdAt;
      const now = new Date();
      switch (dateRange) {
        case 'this_month': return paymentDate >= startOfMonth(now) && paymentDate <= endOfMonth(now);
        case 'last_month': const lastMonth = subMonths(now, 1); return paymentDate >= startOfMonth(lastMonth) && paymentDate <= endOfMonth(lastMonth);
        case 'last_3_months': const threeMonthsAgo = subMonths(now, 3); return paymentDate >= threeMonthsAgo;
        default: return true;
      }
    }
    return true;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = filteredPayments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading payments..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-gray-600">Transaction ID:</span><span className="font-medium">{selectedPayment.transactionId}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Amount:</span><span className="font-medium">₹{selectedPayment.amount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Platform Fee:</span><span className="font-medium">₹{selectedPayment.platformFee.toLocaleString()}</span></div>
              {user?.role === 'lawyer' && (
                <div className="flex justify-between"><span className="text-gray-600">Your Earnings:</span><span className="font-medium text-green-600">₹{selectedPayment.lawyerAmount.toLocaleString()}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-600">Method:</span><span className="font-medium">{selectedPayment.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Status:</span><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>{getStatusIcon(selectedPayment.status)}{selectedPayment.status}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-medium">{format(selectedPayment.createdAt, 'MMM dd, yyyy HH:mm')}</span></div>
              {selectedPayment.completedAt && (
                <div className="flex justify-between"><span className="text-gray-600">Completed:</span><span className="font-medium">{format(selectedPayment.completedAt, 'MMM dd, yyyy HH:mm')}</span></div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-600">Total Amount</p><p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p></div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-600">Completed</p><p className="text-2xl font-bold text-green-600">₹{completedAmount.toLocaleString()}</p></div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-600">Pending</p><p className="text-2xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</p></div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="mt-8 bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                  <div className="text-sm text-gray-500">Appointment #{payment.appointmentId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">₹{payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>{getStatusIcon(payment.status)}{payment.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{format(payment.createdAt, 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleViewDetails(payment)} className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
