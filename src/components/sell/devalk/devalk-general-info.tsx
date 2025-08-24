'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface DeValkGeneralInfoProps {
  form: UseFormReturn<any>;
}

export default function DeValkGeneralInfo({ form }: DeValkGeneralInfoProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 General Information</h2>
        <p className="text-gray-600">Basic yacht specifications and details (De Valk exact structure)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 - Basic Specs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MODEL
            </label>
            <input
              type="text"
              {...register('generalInfo.model')}
              placeholder="e.g., HALLBERG RASSY 49"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TYPE
            </label>
            <input
              type="text"
              {...register('generalInfo.type')}
              placeholder="e.g., monohull sailing yacht"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LOA (M)
            </label>
            <input
              type="text"
              {...register('generalInfo.loaM')}
              placeholder="e.g., 14.96"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LWL (M)
            </label>
            <input
              type="text"
              {...register('generalInfo.lwlM')}
              placeholder="e.g., 12.50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BEAM (M)
            </label>
            <input
              type="text"
              {...register('generalInfo.beamM')}
              placeholder="e.g., 4.42"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DRAFT (M)
            </label>
            <input
              type="text"
              {...register('generalInfo.draftM')}
              placeholder="e.g., 2.20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AIR DRAFT (M)
            </label>
            <input
              type="text"
              {...register('generalInfo.airDraftM')}
              placeholder="e.g., 21.45"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HEADROOM (M)
            </label>
            <input
              type="text"
              {...register('generalInfo.headroomM')}
              placeholder="e.g., 2.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 2 - Builder & Designer */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YEAR BUILT
            </label>
            <input
              type="text"
              {...register('generalInfo.yearBuilt')}
              placeholder="e.g., 1990"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BUILDER
            </label>
            <input
              type="text"
              {...register('generalInfo.builder')}
              placeholder="e.g., Hallberg Rassy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COUNTRY
            </label>
            <input
              type="text"
              {...register('generalInfo.country')}
              placeholder="e.g., Sweden"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DESIGNER
            </label>
            <input
              type="text"
              {...register('generalInfo.designer')}
              placeholder="e.g., Olle Enderlein / Christoph Rassy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DISPLACEMENT (T)
            </label>
            <input
              type="text"
              {...register('generalInfo.displacementT')}
              placeholder="e.g., 18"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BALLAST (TONNES)
            </label>
            <input
              type="text"
              {...register('generalInfo.ballastTonnes')}
              placeholder="e.g., 8.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HULL MATERIAL
            </label>
            <input
              type="text"
              {...register('generalInfo.hullMaterial')}
              placeholder="e.g., GRP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HULL COLOUR
            </label>
            <input
              type="text"
              {...register('generalInfo.hullColour')}
              placeholder="e.g., white"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Column 3 - Hull & Deck Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HULL SHAPE
            </label>
            <input
              type="text"
              {...register('generalInfo.hullShape')}
              placeholder="e.g., S-bilged"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KEEL TYPE
            </label>
            <input
              type="text"
              {...register('generalInfo.keelType')}
              placeholder="e.g., long keel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SUPERSTRUCTURE MATERIAL
            </label>
            <input
              type="text"
              {...register('generalInfo.superstructureMaterial')}
              placeholder="e.g., GRP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DECK MATERIAL
            </label>
            <input
              type="text"
              {...register('generalInfo.deckMaterial')}
              placeholder="e.g., GRP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DECK FINISH
            </label>
            <input
              type="text"
              {...register('generalInfo.deckFinish')}
              placeholder="e.g., teak 2019"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SUPERSTRUCTURE DECK FINISH
            </label>
            <input
              type="text"
              {...register('generalInfo.superstructureDeckFinish')}
              placeholder="e.g., teak 2019"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COCKPIT DECK FINISH
            </label>
            <input
              type="text"
              {...register('generalInfo.cockpitDeckFinish')}
              placeholder="e.g., teak"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Hull & Deck Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DORADES
              </label>
              <input
                type="text"
                {...register('generalInfo.dorades')}
                placeholder="e.g., 5x Vetus"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WINDOW FRAME
              </label>
              <input
                type="text"
                {...register('generalInfo.windowFrame')}
                placeholder="e.g., aluminium"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WINDOW MATERIAL
              </label>
              <input
                type="text"
                {...register('generalInfo.windowMaterial')}
                placeholder="e.g., tempered glass"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DECKHATCH
              </label>
              <input
                type="text"
                {...register('generalInfo.deckHatch')}
                placeholder="e.g., 6x Gebo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FUEL TANK (LITRE)
              </label>
              <input
                type="text"
                {...register('generalInfo.fuelTankLitre')}
                placeholder="e.g., stainless steel 765 ltr"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LEVEL INDICATOR (FUEL TANK)
              </label>
              <input
                type="text"
                {...register('generalInfo.levelIndicatorFuelTank')}
                placeholder="e.g., Wema analogue indicator"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FRESHWATER TANK (LITRE)
              </label>
              <input
                type="text"
                {...register('generalInfo.freshwaterTankLitre')}
                placeholder="e.g., GRP 1400 ltr"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LEVEL INDICATOR (FRESHWATER)
              </label>
              <input
                type="text"
                {...register('generalInfo.levelIndicatorFreshwater')}
                placeholder="e.g., yes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Steering & Controls Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Steering & Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WHEEL STEERING
            </label>
            <input
              type="text"
              {...register('generalInfo.wheelSteering')}
              placeholder="e.g., mechanical"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OUTSIDE HELM POSITION
            </label>
            <input
              type="text"
              {...register('generalInfo.outsideHelmPosition')}
              placeholder="e.g., mechanical"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Field Count Display */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>De Valk General Information Fields:</strong> 35 fields for maximum data extraction
        </p>
      </div>
    </div>
  );
}
