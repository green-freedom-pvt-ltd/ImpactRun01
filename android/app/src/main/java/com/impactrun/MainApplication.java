package com.impactrun;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import net.no_mad.tts.TextToSpeechPackage;
import cl.json.RNSharePackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.dantecervantes.react.FilesPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.xebia.activityrecognition.RNActivityRecognitionPackage;
import com.clevertap.react.CleverTapPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RealmReactPackage(),
            new ReactNativeYouTube(),
            new RNViewShotPackage(),
            new VectorIconsPackage(),
            new TextToSpeechPackage(),
            new RNSharePackage(),
            new ReactNativePushNotificationPackage(),
            new LinearGradientPackage(),
            new RNGoogleSigninPackage(),
            new FilesPackage(),
            new FBSDKPackage(),
            new FacebookLoginPackage(),
            new RNDeviceInfo(),
            new RNActivityRecognitionPackage(),
            new CleverTapPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
