import React from 'react';
import { Users, Clock, MessageCircle, Headphones } from 'lucide-react';

interface HumanAgentHandoffProps {
  title?: string;
  message: string;
  estimatedWaitTime?: string;
}

const HumanAgentHandoff: React.FC<HumanAgentHandoffProps> = ({
  title = "Human Agent Support",
  message,
  estimatedWaitTime
}) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
          
          {estimatedWaitTime && (
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-base text-gray-600 dark:text-gray-300">
                Estimated wait time: <span className="font-medium text-green-600 dark:text-green-400">{estimatedWaitTime}</span>
              </span>
            </div>
          )}
          
          {/* Status Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-base font-medium text-green-700 dark:text-green-300">Agent will connect shortly</span>
            </div>
          </div>
          
          {/* Agent Connection Info */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-base text-gray-900 dark:text-gray-100">Premium Support</p>
                  <p className="text-base text-gray-600 dark:text-gray-300">Dedicated insurance specialist</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span className="text-base font-medium text-green-600 dark:text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* What to Expect */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-lg text-blue-900 dark:text-blue-100 mb-2">What to expect:</h4>
            <ul className="text-base text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Personalized policy walkthrough</li>
              <li>• Help with any questions about your coverage</li>
              <li>• Assistance with additional services</li>
              <li>• Support for future claims or policy changes</li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-base text-gray-600 dark:text-gray-300">
              <strong>Need immediate assistance?</strong> Call us at{' '}
              <span className="font-mono font-medium text-gray-800 dark:text-gray-200">1800-103-2529</span> (Toll Free)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanAgentHandoff;