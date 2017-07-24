//
//  ImpactRunLocationManagerViewController.swift
//  Impactrun
//
//  Created by akash on 19/07/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation
@objc(SampleViewManager)
class SampleViewManager : RCTViewManager {
  override func view() -> UIView! {
    return SampleView();
  }
}
