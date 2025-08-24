'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface DeValkMachineryProps {
  form: UseFormReturn<any>;
}

export default function DeValkMachinery({ form }: DeValkMachineryProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🔧 Machinery</h2>
        <p className="text-gray-600">Details about the yacht's machinery and engine systems (De Valk exact structure)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 - Engine Basics */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NO OF ENGINES
            </label>
            <input
              type="text"
              {...register('machinery.noOfEngines')}
              placeholder="e.g., 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MAKE
            </label>
            <input
              type="text"
              {...register('machinery.make')}
              placeholder="e.g., Volvo Penta"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TYPE
            </label>
            <input
              type="text"
              {...register('machinery.type')}
              placeholder="e.g., TMD41A"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HP
            </label>
            <input
              type="text"
              {...register('machinery.hp')}
              placeholder="e.g., 143"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KW
            </label>
            <input
              type="text"
              {...register('machinery.kw')}
              placeholder="e.g., 105.25"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FUEL
            </label>
            <input
              type="text"
              {...register('machinery.fuel')}
              placeholder="e.g., diesel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YEAR INSTALLED
            </label>
            <input
              type="text"
              {...register('machinery.yearInstalled')}
              placeholder="e.g., 1991"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YEAR OF OVERHAUL
            </label>
            <input
              type="text"
              {...register('machinery.yearOfOverhaul')}
              placeholder="e.g., Major cooling system service 2018"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 2 - Performance & Drive */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MAXIMUM SPEED (KN)
            </label>
            <input
              type="text"
              {...register('machinery.maximumSpeedKn')}
              placeholder="e.g., 9"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CRUISING SPEED (KN)
            </label>
            <input
              type="text"
              {...register('machinery.cruisingSpeedKn')}
              placeholder="e.g., 7.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CONSUMPTION (L/HR)
            </label>
            <input
              type="text"
              {...register('machinery.consumptionLhr')}
              placeholder="e.g., 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ENGINE COOLING SYSTEM
            </label>
            <input
              type="text"
              {...register('machinery.engineCoolingSystem')}
              placeholder="e.g., seawater"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DRIVE
            </label>
            <input
              type="text"
              {...register('machinery.drive')}
              placeholder="e.g., shaft"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SHAFT SEAL
            </label>
            <input
              type="text"
              {...register('machinery.shaftSeal')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ENGINE CONTROLS
            </label>
            <input
              type="text"
              {...register('machinery.engineControls')}
              placeholder="e.g., bowden cable"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GEARBOX
            </label>
            <input
              type="text"
              {...register('machinery.gearbox')}
              placeholder="e.g., mechanical"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 3 - Additional Systems */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BOWTHRUSTER
            </label>
            <input
              type="text"
              {...register('machinery.bowthruster')}
              placeholder="e.g., electric | Sleipner 7 hp"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PROPELLER TYPE
            </label>
            <input
              type="text"
              {...register('machinery.propellerType')}
              placeholder="e.g., fixed | blades"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MANUAL BILGE PUMP
            </label>
            <input
              type="text"
              {...register('machinery.manualBilgePump')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ELECTRIC BILGE PUMP
            </label>
            <input
              type="text"
              {...register('machinery.electricBilgePump')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ELECTRICAL INSTALLATION
            </label>
            <input
              type="text"
              {...register('machinery.electricalInstallation')}
              placeholder="e.g., 12-24-230 V"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GENERATOR
            </label>
            <input
              type="text"
              {...register('machinery.generator')}
              placeholder="e.g., wet exhaust Westerbeke 8 kW"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BATTERIES
            </label>
            <input
              type="text"
              {...register('machinery.batteries')}
              placeholder="e.g., 5 x Greenline 12V - 105Ah deep cycle | new 04-2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              START BATTERY
            </label>
            <input
              type="text"
              {...register('machinery.startBattery')}
              placeholder="e.g., 1 x 105Ah"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Battery & Electrical Systems Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Battery & Electrical Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SERVICE BATTERY
              </label>
              <input
                type="text"
                {...register('machinery.serviceBattery')}
                placeholder="e.g., 4 x 105Ah for 24V - 210 Ah"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BATTERY MONITOR
              </label>
              <input
                type="text"
                {...register('machinery.batteryMonitor')}
                placeholder="e.g., Odelco DCC 2000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BATTERY CHARGER
              </label>
              <input
                type="text"
                {...register('machinery.batteryCharger')}
                placeholder="e.g., Victron Centaur 24v 60Ah | victron chargemaster 12 25-3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SOLAR PANEL
              </label>
              <input
                type="text"
                {...register('machinery.solarPanel')}
                placeholder="e.g., Solbian 2 x SR166 2023"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SHOREPOWER
              </label>
              <input
                type="text"
                {...register('machinery.shorepower')}
                placeholder="e.g., with cable"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WATERMAKER
              </label>
              <input
                type="text"
                {...register('machinery.watermaker')}
                placeholder="e.g., Not connected incl. 2 new spare membranes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Extra Info Section */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          EXTRA INFO
        </label>
        <textarea
          {...register('machinery.extraInfo')}
          placeholder="e.g., Major maintenance service 2022"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Field Count Display */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>De Valk Machinery Fields:</strong> 30 fields for maximum data extraction
        </p>
      </div>
    </div>
  );
}
