import React, { useEffect, useState, useMemo } from 'react';
import { FaUser, FaCrown } from 'react-icons/fa';

const BidHistory = ({ auctionId, realTimeBids = [] }) => {
  const sortedBids = useMemo(() => {
    return [...realTimeBids].sort((a, b) => b.amount - a.amount);
  }, [realTimeBids]);

  return (
    <div className="mt-3">
      <h4 className="fs-3 fw-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent inline-d-block">
        Bid History
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-100 bg-white rounded-xl overflow-d-none">
          <thead className="bg-light">
            <tr>
              <th className="py-3 px-3 text-start text-xs font-medium text-secondary uppercase tracking-wider">
                Bidder
              </th>
              <th className="py-3 px-3 text-start text-xs font-medium text-secondary uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-3 text-start text-xs font-medium text-secondary uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-3 text-start text-xs font-medium text-secondary uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedBids.map((bid, index) => (
              <tr key={bid.id} className="hover:bg-light transition-colors">
                <td className="py-3 px-3">
                  <div className="d-flex align-items-center">
                    <div className="w-8 h-8 bg-theme-gradient rounded-circle d-flex align-items-center justify-content-center text-white">
                      {index === 0 ? (
                        <FaCrown className="text-yellow-300" />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <span className="ml-2 font-medium text-dark">{bid.createdBy}</span>
                  </div>
                </td>
                <td className="py-3 px-3 fw-semibold text-primary-600">
                  ${bid.amount}
                </td>
                <td className="py-3 px-3 text-secondary">
                  {new Date(bid.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  {index === 0 ? (
                    <span className="inline-d-flex align-items-center px-3 py-1 rounded-circle fs-6 font-medium bg-success-50 text-success-600">
                      Highest Bid
                    </span>
                  ) : (
                    <span className="inline-d-flex align-items-center px-3 py-1 rounded-circle fs-6 font-medium bg-danger-50 text-danger-600">
                      Outbid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedBids.length === 0 && (
          <div className="text-center py-8 text-secondary">
            No bids yet. Be the first to bid!
          </div>
        )}
      </div>
    </div>
  );
};

export default BidHistory;