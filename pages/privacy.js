
import React from 'react';
import Head from 'next/head';

import WindowObserver from '../components/WindowObserver';
import BackToTop from '../components/BackToTop';
import AfterEvent from '../components/AfterEvent';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

import withRedux from '../storage';

class Privacy extends React.Component {

  render () {
    return <div>

      <style jsx>{`
        .container {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 130px;
          padding-bottom: 130px;
          padding-left: 0;
          padding-right: 0;
          width: 300px;
          max-width: 100%;
          max-width: calc(100% - 40px);
        }
        h1 {
          margin-top: 20px;
          margin-bottom: 20px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.3;
          color: #000;
        }
        h2 {
          margin-top: 15px;
          margin-bottom: 15px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 20px;
          font-weight: 300;
          line-height: 1.1;
          color: #000;
        }
        p {
          margin-top: 10px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 18px;
          font-weight: 300;
          line-height: 1.4;
          color: #000;
        }
        @media (min-width: 680px) {
          .container {
            width: 620px;
          }
          h1 {
            font-size: 30px;
          }
          h2 {
            font-size: 30px;
          }
          p {
            font-size: 18px;
          }
        }
        @media (min-width: 1000px) {
          .container {
            width: 940px;
          }
        }
      `}</style>

      <Head>
        <title>Privacy Policy</title>
      </Head>

      <WindowObserver />
      <AppHeader />

      <BackToTop id="privacy" />

      <div className="container">
        <h1 className="headline">Privacy Policy</h1>
        <p>This document forms a part of the Terms of Service established by VANIILA INC.  (the “Company”) and incorporates the defined terms as set out in such Terms of Service.</p>
        <h2>What Information We Collect</h2>
        <p>The types of information that we collect fall under two general categories: personally identifiable information (PII) and non-personally identifiable information (non-PII). PII consists of any information which can be used to specifically identify you as an individual, whereas non-PII consists of aggregate information or any information that does not reveal your identity. The following sections describe how your PII and non-PII are collected by us, and how we use such information.</p>
        <h2>How We Collect and Use Information</h2>
        <ul>
          <li><p>Log Files and Usage Data. Any time you visit any of our websites, our servers or those of our third-party data analytic providers (e.g. Google Analytics) automatically gather information from your browser (such as your IP addresses, location, browser type, Internet service provider (ISP), referring/exit pages, platform type, date/time stamp, and number of clicks) to analyze trends, administer the site, prevent fraud, track visitor movement in the aggregate, and gather broad demographic information. For example, we may log your IP address for system administration purposes. IP addresses are logged to track a user’s session. This gives us an idea of which parts of our site users are visiting. We do not share the log files and user specific user data externally.Aggregated data on the use of our Service may be shared with third-parties at our sole discretion and such aggregated data is the sole property of the Company. </p></li>
          <li><p>Cookies. We may use “cookies” to keep track of some types of information while you are visiting our website or using our services. Cookies are very small files placed on your computer, and they allow us to count the number of visitors to our website and distinguish repeat visitors from new visitors. They also allow us to save user preferences and track user trends. We may rely on cookies for the proper or improved operation of our website; therefore if your browser is set to reject all cookies, the website may not function properly. Users who refuse cookies assume all responsibility for any resulting loss of functionality. We do not link the cookies to any PII.</p></li>
          <li><p>Web Beacons. “Web beacons” (also known as “clear gifs”and “pixel tags”) are small transparent graphic images that are often used in conjunction with cookies in order to further personalize our website for our users and to collect a limited set of information about our visitors. We may also use web beacons in email communications in order to understand the behavior of our customers. We do not link the web beacons to any PII.</p></li>
          <li><p>Information About You. When you register, subscribe to or make use of any of our services, we collect a wide variety of information about you. PII about yourself (such as your name) will be used to build your profile on the site and deliver our Service to you.  This is information is collected out of necessity in order to deliver our Services to you, however it is entirely voluntary and you may change or remove any PII you provided to us at any time, or delete your account on the Service entirely.</p></li>
          <li><p>E-mails and Telephone Calls. We require an e-mail address from you when you register for our services. We use your e-mail for both transactional and promotional (e.g., newsletters, new product offerings, event notifications, special third-party offers) purposes. E-mail messages we send you may contain code that enables our database to track your usage of the e-mails, including whether the e-mail was opened and what links (if any) were clicked. We reserve the right to send you certain communications relating to the Company’s services, such as service announcements and administrative messages, provided we offer you the opportunity to opt out of receiving them. We may also contact you by telephone or text message (including to any wireless number you may provide to us) solely in connection with the Company’s services. You have consented to these communications by your user of the Company Service, account creation process and/or website as defined in the Terms of Service, however you may revoke this consent at any time.</p></li>
          <li><p>Demographic Data. Demographic data is also collected at our site. We use this data to tailor our visitors’ experience at our site, showing them content that we think they might be interested in, and displaying the content according to their preferences. Some of this information may be shared with advertisers on a non-personally identifiable basis.</p></li>
          <li><p>Online Survey Data. We may periodically conduct voluntary member surveys. Weencourage our members to participate in such surveys because they provide us with important information regarding the improvement of our services. You may also volunteer for certain surveys that we may offer to our users, and any additional rules regarding the conduct of such surveys will be disclosed to you prior to your participation. We do not link the survey responses to any PII unless you expressly and voluntarily provide it during the survey, otherwise all responses are voluntary and anonymous.</p></li>
        </ul>
        <h2>Disclosure of Your Information to Third Parties</h2>
        <ul>
          <li><p>Disclosure By Law. You acknowledge and agree that we may disclose information you provide if required to do so by law, at the request of a third party, or if we, in our sole discretion, believe that disclosure is reasonable to (1) comply with the law, requests or orders from law enforcement, or any legal process (whether or not such disclosure is required by applicable law); (2) protect or defend the Company, or a third party’s, rights or property; or (3) protect someone’s health or safety, such as when harm or violence against any person (including you) is threatened.</p></li>
          <li><p>Disclosure to Protect Abuse Victims. Notwithstanding any other provision of this privacy statement or our Terms and Conditions of Service, we reserve the right, but have no obligation, to disclose any information that you submit to the Services, if in our sole opinion, we suspect or have reason to suspect, that the information involves a party who may be the victim of abuse in any form. Abuse may include, without limitation, elder abuse, child abuse, spousal abuse, neglect, or domestic violence. Information may be disclosed to authorities that we, in our sole discretion, deem appropriate to handle such disclosure. Appropriate authorities may include, without limitation, law enforcement agencies, child protection agencies, or court officials. You hereby acknowledge and agree that we are permitted to make such disclosure.</p></li>
          <li><p>Disclosure to Trusted Third Parties By Us. We may share your non-PII with third parties, but not in a manner that would reveal your identity. We may share your PII, sometimes in conjunction with your non-PII, with service providers that may be associated with us to perform functions on our behalf. For example, outsourced customer care agents or technology assistants may need access to your information to perform services for you. Your information will be treated as private and confidential by such service providers and not used for any other purpose than we authorize.</p></li>
          <li><p>Disclosure to Trusted Third Parties at Your Request. While visiting our site, we may provide you with offers of introductions, advertisements, promotions, sweepstakes and offers from third party providers. If you choose to accept any such offers, you may either (depending on the situation) directly provide your information in connection with the offer to such third party provider, or we will provide your information to the third party provider in a manner that is suitable to the context.  For example, by pre-populating the offer registration forms or relaying your contact information to the third party. Your information will not be transferred unless you have specifically requested that we do so. You may opt-out of the offer at any time up until that point. Please refer to the third party provider’s own privacy policy (provided on their website) if you have any questions regarding how your information is used by such providers. Please be aware that these offers may be presented on pages framed by a Company website. We do this to provide a seamless experience. Although these offer pages have the look and feel of our websites, you will be submitting your information directly to the third-party advertiser. You agree that we will not be responsible or liable for any loss or damage of any sort incurred as the result of any such dealings, including the sharing of the information you supply to us with third party providers described here, or as the result of the presence of such providers on a Company website.</p></li>
        </ul>
        <h2>Third-Party Advertising</h2>
        <p>We may use third-party advertising agencies or other service providers to serve ads or other content on our website on behalf of the Company or third-party advertisers (e.g., retailers of goods or services). These companies may employ cookies and web beacons to measure advertising effectiveness or tailor advertising or other content. Any information that these third parties collect via cookies and web beacons is completely anonymous to the best of our knowledge.</p>
        <p>We will only share your information with third parties in the ways defined in this privacy statement.</p>
        <h2>Age Restrictions</h2>
        <p>Our age restrictions for our Services are set forth in our Terms of Service. Any information received regarding a user who is below the age of majority in our home jurisdiction of the Province of Alberta (being 18 years of age), is received according to our Terms of Service.  Any information we may receive from users we believe to be under the age of majority without the consent of a parent or guardian, in accordance with our Terms of Service, will be purged from our database when we in fact become aware of such circumstance.</p>
        <h2>Security</h2>
        <p>We will exercise reasonable care in providing secure transmission of information between your computer and our servers, but given that no information transmitted over the Internet can be guaranteed 100% secure, we cannot ensure or warrant the security of any information transmitted to us over the Internet and hence accept no liability for any unintentional disclosure.</p>
        <h2>Retention and Storage of Your Personal Information</h2>
        <p>We retain your PII for as long as necessary to fulfill the purpose(s) for which it was collected and to comply with applicable laws, and your consent to such purpose(s) remains valid after termination of your relationship with us. Your PII may be processed and stored outside of the province in which you reside and/or outside of Canada by us, an affiliate or an unaffiliated service provider for the purposes set out in this privacy statement and, under the laws of these other jurisdictions, in certain circumstances foreign courts, law enforcement agencies or regulatory agencies may be entitled to access your personal information.</p>
        <h2>Links to Other Sites</h2>
        <p>You may be able to access your account or content of your account from third party sites, such as social networking sites, by way of various applications. The privacy policies and practices of such sites in connection with information you disclose on such sites may differ from the practices of the Company as set forth in this privacy statement, and you should review their policies and practices to ensure that the privacy of the information you submit on their site does not conflict with and is consistent with how you wish your information to be treated. Such sites may also place their own cookies or other files on your computer, collect data or solicit personal information from you. We are not responsible for the privacy practices or the content of other websites that may provide access to, or be linked to or from this site, including that of any social networking sites and third party advertisers whose offerings require you to navigate away from our site.</p>
        <h2>Contacting the Website</h2>
        <p>If you have any questions about the practices of this site, or your dealings with any the Service provided by the Company, you can contact:</p>
        <p>hello@vaniila.com</p>
        <h2>Agreement and Revisions</h2>
        <p>Your use of our website(s), including any dispute concerning privacy, is subject to this privacy statement and the applicable Terms of Service. </p>
        <p><strong>BY USING THE SERVICE INCLUDING THE COMPANY WEBSITE AND/OR APP(S), YOU ARE ACCEPTING THE PRACTICES SET OUT IN THIS PRIVACY STATEMENT AND THE APPLICABLE TERMS OF SERVICE.</strong></p>
        <p>If we decide to change our privacy policy, we will make reasonable efforts to post notice of such changes in such location as we deem appropriate so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we disclose it. We reserve the right to modify this privacy statement at any time, so please review it frequently. If we make material changes to this policy, we will make reasonable efforts to identify those changes here, or notify you by other means, such as e-mail, at our sole discretion.</p>
        <p>Your continued use of any portion of our website following posting of the updated privacy statement will constitute your acceptance of the changes.</p>
        <h2>Effective Date</h2>
        <p>This privacy statement was last revised on November 22, 2016.</p>
      </div>

      <AppFooter />

    </div>
  }

}

export default withRedux(Privacy);

