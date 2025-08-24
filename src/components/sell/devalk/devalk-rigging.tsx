'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface DeValkRiggingProps {
  form: UseFormReturn<any>;
}

export default function DeValkRigging({ form }: DeValkRiggingProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">⛵ Rigging</h2>
        <p className="text-gray-600">Details about the yacht's rigging and sail systems (De Valk exact structure)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 - Basic Rigging */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RIGGING
            </label>
            <input
              type="text"
              {...register('rigging.rigging')}
              placeholder="e.g., sloop"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              STANDING RIGGING
            </label>
            <input
              type="text"
              {...register('rigging.standingRigging')}
              placeholder="e.g., wire Riggingservice and check 2019"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BRAND MAST
            </label>
            <input
              type="text"
              {...register('rigging.brandMast')}
              placeholder="e.g., Seldén"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MATERIAL MAST
            </label>
            <input
              type="text"
              {...register('rigging.materialMast')}
              placeholder="e.g., aluminium"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPREADERS
            </label>
            <input
              type="text"
              {...register('rigging.spreaders')}
              placeholder="e.g., 3 sets"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MAINSAIL
            </label>
            <input
              type="text"
              {...register('rigging.mainsail')}
              placeholder="e.g., New 2023 De vries maritiem lemmer 55m2 cross cut"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              STOWAY MAST
            </label>
            <input
              type="text"
              {...register('rigging.stowayMast')}
              placeholder="e.g., Seldén electric"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CUTTERSTAY
            </label>
            <input
              type="text"
              {...register('rigging.cutterstay')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 2 - Sails & Furlers */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              JIB
            </label>
            <input
              type="text"
              {...register('rigging.jib')}
              placeholder="e.g., Ullman sails"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GENOA
            </label>
            <input
              type="text"
              {...register('rigging.genoa')}
              placeholder="e.g., New 2023 De vries maritiem lemmer 77 m2 cross cut"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GENOA FURLER
            </label>
            <input
              type="text"
              {...register('rigging.genoaFurler')}
              placeholder="e.g., Furlex 400e Electric"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CUTTER FURLER
            </label>
            <input
              type="text"
              {...register('rigging.cutterFurler')}
              placeholder="e.g., Furlex"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GENNAKER
            </label>
            <input
              type="text"
              {...register('rigging.gennaker')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPINNAKER
            </label>
            <input
              type="text"
              {...register('rigging.spinnaker')}
              placeholder="e.g., yes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              REEFING SYSTEM
            </label>
            <input
              type="text"
              {...register('rigging.reefingSystem')}
              placeholder="e.g., main in-mast furling"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BACKSTAY ADJUSTER
            </label>
            <input
              type="text"
              {...register('rigging.backstayAdjuster')}
              placeholder="e.g., hydraulic | Navtec"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 3 - Winches & Equipment */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PRIMARY SHEET WINCH
            </label>
            <input
              type="text"
              {...register('rigging.primarySheetWinch')}
              placeholder="e.g., 2x Lewmar 43 self tailing"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SECONDARY SHEET WINCH
            </label>
            <input
              type="text"
              {...register('rigging.secondarySheetWinch')}
              placeholder="e.g., Lewmar 46 self tailing"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GENOA SHEETWINCHES
            </label>
            <input
              type="text"
              {...register('rigging.genoaSheetwinches')}
              placeholder="e.g., 2x Lewmar 64 self tailing electric"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HALYARD WINCHES
            </label>
            <input
              type="text"
              {...register('rigging.halyardWinches')}
              placeholder="e.g., 2x Lewmar 43 self tailing"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MULTIFUNCTIONAL WINCHES
            </label>
            <input
              type="text"
              {...register('rigging.multifunctionalWinches')}
              placeholder="e.g., Lewmar 8 Pole hoist winch | Lewmar ocean electric 40"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPI-POLE
            </label>
            <input
              type="text"
              {...register('rigging.spiPole')}
              placeholder="e.g., aluminium"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Rigging Details Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Rigging Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BOOM
              </label>
              <input
                type="text"
                {...register('rigging.boom')}
                placeholder="e.g., v"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BOOMVANG
              </label>
              <input
                type="text"
                {...register('rigging.boomvang')}
                placeholder="e.g., mechanical and tackle Selden"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                JOCKEY-POLE
              </label>
              <input
                type="text"
                {...register('rigging.jockeyPole')}
                placeholder="e.g., aluminium Selden"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KEEL STEPPED MAST
              </label>
              <input
                type="text"
                {...register('rigging.keelSteppedMast')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                STAYSAIL
              </label>
              <input
                type="text"
                {...register('rigging.staysail')}
                placeholder="e.g., Dracon (03.2022)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                STAYSAIL FURLER
              </label>
              <input
                type="text"
                {...register('rigging.staysailFurler')}
                placeholder="e.g., Selden Furlex 400S"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YANKEE
              </label>
              <input
                type="text"
                {...register('rigging.yankee')}
                placeholder="e.g., Dracon (03.2022)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SELF TACKING JIB INSTALLATION
              </label>
              <input
                type="text"
                {...register('rigging.selfTackingJibInstallation')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field Count Display */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>De Valk Rigging Fields:</strong> 25+ fields for maximum data extraction
        </p>
      </div>
    </div>
  );
}
