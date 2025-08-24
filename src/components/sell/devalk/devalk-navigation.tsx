'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface DeValkNavigationProps {
  form: UseFormReturn<any>;
}

export default function DeValkNavigation({ form }: DeValkNavigationProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🧭 Navigation</h2>
        <p className="text-gray-600">Details about the yacht's navigation equipment (De Valk exact structure)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COMPASS
            </label>
            <input
              type="text"
              {...register('navigation.compass')}
              placeholder="e.g., Plastimo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ELECTRIC COMPASS
            </label>
            <input
              type="text"
              {...register('navigation.electricCompass')}
              placeholder="e.g., Raymarine"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DEPTH SOUNDER
            </label>
            <input
              type="text"
              {...register('navigation.depthSounder')}
              placeholder="e.g., Raymarine ST60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LOG
            </label>
            <input
              type="text"
              {...register('navigation.log')}
              placeholder="e.g., Raymarine ST60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WINDSET
            </label>
            <input
              type="text"
              {...register('navigation.windset')}
              placeholder="e.g., Raymarine ST60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              REPEATER
            </label>
            <input
              type="text"
              {...register('navigation.repeater')}
              placeholder="e.g., 2 x Raymarine i70"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VHF
            </label>
            <input
              type="text"
              {...register('navigation.vhf')}
              placeholder="e.g., Standard Horizon Explorer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VHF HANDHELD
            </label>
            <input
              type="text"
              {...register('navigation.vhfHandheld')}
              placeholder="e.g., Standard Horizon"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AUTOPILOT
            </label>
            <input
              type="text"
              {...register('navigation.autopilot')}
              placeholder="e.g., Raymarine EV 400 (p70)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RUDDER ANGLE INDICATOR
            </label>
            <input
              type="text"
              {...register('navigation.rudderAngleIndicator')}
              placeholder="e.g., Raymarine p70"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RADAR
            </label>
            <input
              type="text"
              {...register('navigation.radar')}
              placeholder="e.g., Pathfinder RL 80C"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PLOTTER/GPS
            </label>
            <input
              type="text"
              {...register('navigation.plotterGps')}
              placeholder="e.g., Raymarine Axiom 9"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ELECTRONIC CHART(S)
            </label>
            <input
              type="text"
              {...register('navigation.electronicCharts')}
              placeholder="e.g., Navionics"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AIS TRANSCEIVER
            </label>
            <input
              type="text"
              {...register('navigation.aisTransceiver')}
              placeholder="e.g., Raymarine AIS 650"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              EPIRB
            </label>
            <input
              type="text"
              {...register('navigation.epirb')}
              placeholder="e.g., RescueMe Ocean Signal"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NAVIGATION LIGHTS
            </label>
            <input
              type="text"
              {...register('navigation.navigationLights')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Extra Info Section */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          EXTRA INFO
        </label>
        <textarea
          {...register('navigation.extraInfo')}
          placeholder="e.g., New 2019 | Iridium GO satellite receiver..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Field Count Display */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>De Valk Navigation Fields:</strong> 17 fields for maximum data extraction
        </p>
      </div>
    </div>
  );
}
