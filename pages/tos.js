
import React from 'react';
import Head from 'next/head';

import WindowObserver from '../components/WindowObserver';
import BackToTop from '../components/BackToTop';
import AfterEvent from '../components/AfterEvent';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

import withRedux from '../storage';

class Tos extends React.Component {

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
        h2, h5 {
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
        p a {
          text-decoration: none;
          color: #1986ea;
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
        <title>Terms of Service</title>
      </Head>

      <WindowObserver />
      <AppHeader />

      <BackToTop id="tos" />

      <div className="container">
        <h1>Terms of Service</h1>
        <p>These  Terms  of  Service  govern  the  use  of  the  services  offered  by  Vaniila  Inc.  (the “Company”)   at   the   Company’s   website,   including   but   not   limited   to   the   domain vaniila.com,  (the “Site”)  and  any  mobile  applications  made  available  on  any  mobile device (individually or collectively referred to as the “App”). Such services being the Site and/or   the   App   are   collectively   referred   to   herein   as   the “Service.”   Accessing, downloading, or using the Service constitutes: </p>
        <ol>
          <li><p>your  acceptance  of  and  agreement  to  the  terms  and  conditions contained  in these Terms of Service;</p></li>
          <li><p>your acceptance of and agreement to the terms and conditions contained in the <a href="/privacy">Company’s Privacy Policy</a> (the “Privacy Policy”);</p></li>
          <li><p>your representation that you are 18 years of age or older; and </p></li>
          <li><p>your representation that if you are using the Service on behalf of a business, you have authority to bind that business and in fact agree to these Terms on behalf of that business.</p></li>
        </ol>
        <p>The Privacy Policy is incorporated by reference into these Terms of Service, which is collectively referred to herein as this “Agreement.”</p>
        <p><strong>If you do not accept these Terms of Service and the Privacy Policy in their entirety you are not permitted to use the Service. Although you are advised to review these Terms of Service in detail, for ease of understanding, key considerations include:</strong></p>
        <p><strong>Your agreement that the Service is provided “as is” and without warranty.</strong></p>
        <p><strong>Your agreement that the Company has no liability regarding the Service.</strong></p>
        <p><strong>Your consent to release the Company from liability based on claims between Users and generally.</strong></p>
        <p><strong>Your agreement to indemnify the Company from claims due to your use or inability to use the Service or content submitted from your account to the Service.</strong></p>
        <p><strong>Your consent that all disputes must be resolved by arbitration.</strong></p>
        <h2>Grant of Licence</h2>
        <p>Based upon your acceptance of, and subject to your compliance with this Agreement, the Company grants you a non-exclusive, non-transferable, non-sublicensable, terminable license to access and use the Services for your personal use only.</p>
        <p>You agree to not access, reproduce, duplicate, copy, sell, re-sell, modify, distribute, transmit, or otherwise exploit the Service or any of its content for any purpose except for your personal use and as described in this Terms of Use, without the express written consent of the Company.  The Company may modify, update, suspend or discontinue the Service, in whole or in part, at its sole discretion for any or no reason, at any time and with or without notice.  The Company will not be liable to any user or other third party for any such modification, update, suspension or discontinuance.</p>
        <h2>Scope of Service</h2>
        <p>The Service is an online software tool which allows you to create. design and complete visual presentations to share your ideas, stories, concepts or other materials.  The Service provides a platform and suite of functions to both produce these presentations and share them with your friends, colleagues, as well as current or prospective clients and customers.</p>
        <h2>Service as a Medium Only</h2>
        <p>The Service is a passive medium and platform for the exchange of information and in some cases, expression of opinion by Users, and as such you agree that the Company is not responsible for the conduct or performance of Users, nor does it have control over the quality, timing, legality, failure to provide, or any other aspect whatsoever of the information posted by Users and published on the Service. Further the Company has no ability to verify, validate, quantify, qualify or otherwise confirm or represent the integrity, responsibility, honesty, capability, reliability or any of the products, services, actions or omissions whatsoever of any Users or the information they have published on the Service.</p>
        <p><strong>USERS ENGAGE IN THE SERVICE AT THEIR OWN RISK AND MUST RELY ON THEIR OWN JUDGMENT IN SUBMITTING CONTENT, EXPRESSING OPINIONS, PURCHASING PRODUCTS OR SERVICES FROM A BUSINESS LOCATED THROUGH THE SERVICE, AND IN ANY AND ALL OTHER USE OF THE SERVICE.</strong></p>
        <p><strong>Although the Company may, through these Terms of Service or other policies in effect from time to time, attempt to maximize the quality of the information and content provided on or through the Service, you agree that such efforts do not imply any representation or warranty by the Company in respect to such information nor do they detract from the general limitations on liability contained in these Terms of Service. Further, you agree that the Company has the right to change any such policies or practices at any time, in its sole and unfettered discretion, without notice.</strong></p>
        <p><strong>Be advised that the Company has not reviewed the User Generated Content published on or through the Service, and it is the responsibility of each viewer to determine whether such User Generated Content is appropriate for their intended use, purpose and/or audience.  The Company is not responsible for User Generated Content published on or through the Service.  In the event you find content published on the Service that you feel is offensive, harmful, illegal or otherwise concerning, please contact <a href="mailto:abuse@vaniila.com">abuse@vaniila.com</a>.</strong></p>
        <h2>Release</h2>
        <p><strong>WHEREAS THE SERVICE IS PROVIDED BY THE COMPANY ONLY AS A MEDIUM AND PLATFORM FOR SHARING INFORMATION PUBLISHED BY USERS, AND AS THE COMPANY DOES NOT PARTICIPATE IN THE CREATION OF USER DOCUMENTS AND PRESENTATION OR IN THE PROVISION OF GOODS AND/OR SERVICES PROMOTED THROUGH THE SERVICE, IN THE EVENT THAT YOU HAVE A DISPUTE WITH ONE OR MORE OTHER USERS IN RESPECT TO THE SERVICE IN ANY WAY, PROVISION OF GOODS AND/OR SERVICES, PROVISION OF PAYMENT, USE OF INTELLECTUAL PROPERTY, OR FOR ANY REASON WHATSOEVER, YOU RELEASE THE COMPANY AND ITS OFFICERS, DIRECTORS, AGENTS, INVESTORS, AFFILIATES, SUBSIDIARIES, AND EMPLOYEES FROM ANY AND ALL CLAIMS, DEMANDS, OR DAMAGES (ACTUAL OR CONSEQUENTIAL) OF EVERY KIND AND NATURE, KNOWN AND UNKNOWN, DISCLOSED AND UNDISCLOSED, ARISING OUT OF OR IN ANY WAY CONNECTED WITH SUCH DISPUTE.</strong></p>
        <p><strong>COMPANY EXPRESSLY DISCLAIMS ANY LIABILITY WHATSOEVER THAT MAY ARISE BETWEEN USERS OF ITS SERVICE OR BETWEEN A USER OF ITS SERVICE AND ANY THIRD PARTY.</strong></p>
        <h2>User Conduct and Conditions of Use</h2>
        <p>As a condition of your access to and use of the Service, you may not:</p>
        <ol>
          <li><p>Take any action in violation of these Terms of Service;</p></li>
          <li><p>Use the Service if you are under the age of thirteen (13);</p></li>
          <li><p>Defame, abuse, harass, stalk, threaten or otherwise violate the legal rights of other Users nor the Company or its directors, officers, employees, agents, investors or affiliates;</p></li>
          <li><p>Publish, post, upload, distribute or disseminate any profane, defamatory, infringing, harmful, threatening, hateful, racist, vulgar, obscene or unlawful topic, name, material or information;</p></li>
          <li><p>Use the Service for any purpose in violation of local, provincial, federal, or international law or in violation of any third party's rights, including, but not limited to, transmitting any content that may infringe, misappropriate or violate a third party's rights of publicity, contractual rights, fiduciary rights or intellectual property rights;</p></li>
          <li><p>Upload files that contain software or other material that violates the intellectual property rights of any third party;</p></li>
          <li><p>Upload or post a link to files that contain viruses, Trojan horses, corrupted files, or any other similar software that may damage the operation of another's computer;</p></li>
          <li><p>Post or upload any content to which you have not obtained any necessary rights or permissions to use accordingly;</p></li>
          <li><p>Conduct or forward surveys, contests, pyramid schemes, or chain letters;</p></li>
          <li><p>Impersonate another User, person or business;</p></li>
          <li><p>Sell, transfer, or in any way allow any other person or entity to use your account or its access information (including username and password) to use the Service;</p></li>
          <li><p>Download any file posted by another User that a User knows, or reasonably should know, cannot be legally distributed through the Service;</p></li>
          <li><p>Restrict or inhibit any other User from using and enjoying the public areas of the Service or take any action that might have a negative effect on the operation of the Service, reduce its capacity or otherwise hinder the use of the Service by other Users generally.</p></li>
          <li><p>Imply or state that any statements you make are endorsed by the Company, without the prior written consent of the Company which may be withheld at its sole and unfettered discretion;</p></li>
          <li><p>Use a robot, spider, manual and/or automatic processes or devices to data-mine, data-crawl, scrape or index the Service in any manner;</p></li>
          <li><p>Hack or interfere with the Service, its servers or any connected networks;</p></li>
          <li><p>Adapt, alter, license, sublicense or translate the Service for your own personal or commercial use.</p></li>
          <li><p>Remove or alter, visually or otherwise, any copyrights, trademarks or proprietary marks and rights owned by Company;</p></li>
          <li><p>Download, save, duplicate, copy, modify, sell, or otherwise exploit any content or the Service generally for any commercial, educational, or other non-personal purpose or any for any purpose other than that for which the Service is intended;</p></li>
          <li><p>Intentionally or negligently publishing false or misleading information on the Service or providing the same to any User of the Service;</p></li>
          <li><p>Upload content that is offensive and/or harmful, including, but not limited to, content that advocates, endorses, condones or promotes racism, bigotry, hatred or physical harm of any kind against any individual, group of individuals, business, industry or corporation;</p></li>
          <li><p>Upload content that provides materials or access to materials that exploit people of any age in an abusive, violent or sexual manner;</p></li>
          <li><p>Use the Service to collect usernames and or/email addresses of Users by electronic or other means;</p></li>
          <li><p>Make any attempt through the Service itself, or by accessing or connecting to the Service in any way, including but not limited to hacking, password “brute force” attack, or denial of service attack, to negatively affect the operation or availability of the Service, gain unauthorized access to the Service, test for vulnerabilities in the Service or its networks, access other User’s accounts, access other computer software, hardware or networks that may be connected to, host, support or otherwise interact with the Service; </p></li>
          <li><p>Register under different usernames or identities, after your account has been suspended or terminated or to obtain multiple free trial period or other offers that may be made by Company from time to time;</p></li>
        </ol>
        <p>You understand that all submissions made to through the Service, whether in an obviously public area or not, may be public and that you may be publicly identified by your name or login identification when communicating through or on the Service, and Company will not be responsible for the action of any Users with respect to any information or materials posted through or on the Service.</p>
        <h2>User Granted Licences</h2>
        <p>As to Other Users</p>
        <h5>Public Content</h5>
        <p>All of your content created or published on the Service which is marked as “Public” (or left as the default setting of “Public”), including all information within your presentations, and your name and/or user name, will be publically available to anyone who has access to the internet (“Public Content”). Public Content can be viewed by other Users, will appear in the search results on the Service generated from the Service database(s), and will be accessible to others online. All Public Content may also be duplicated and revised, in whole or part, by another User, meaning that such content may be copied to their account on the Service (known as forking) and modifications made to such content.</p>
        <p>Accordingly, you hereby grant to each User and to the public a worldwide, non-exclusive, revocable license to access, view, use, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display, distribute and transmit your Public Content, or any portion of it. This license ends only when your account is closed and deleted, except to the extent that such content has been saved, shared, and/or revised by other Users.</p>
        <h5>Private Content</h5>
        <p>All of your content created or published on the Service which is marked as “Private” will not be openly available to the public. Such Private Content will be accessible to your and others Users with whom you have specifically provided access to said content by way of the sharing functions on the Service (a “Shared User”).</p>
        <p>You hereby do and shall grant to each Shared User a worldwide, non-exclusive, revocable license to access, view, use, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display, distribute and transmit your Private Content, or any portion of it. This license ends only when your account is closed and deleted, except to the extent that such content has been saved, shared, and/or revised by other Shared Users.</p>
        <p>As to the Company</p>
        <h5>Public Content</h5>
        <p>With respect to your Public Content, you hereby grant to the Company (and its successors, assigns, and third-party service providers) a worldwide, non-exclusive, revocable, royalty-free, sub-licensable, and transferable license to use, publish, publicly perform or display, distribute, transmit, host, store, reproduce, modify, and create derivative works from the Public Content for the purpose of providing the Service, and in for the marketing and promotion of the Company and/or the Service, including but not limited to allowing such Public Content to be indexed, searched, listed or cataloged by third parties, facilitating email, social media or other advertising campaigns, and product demonstrations. Further, even if you have removed your Public Content from your account, you agree and acknowledge that it may be retained, backed-up or archived by the Company, at its sole and unfettered discretion, in which case such archived Public Content will remain subject to the forgoing licence indefinitely until your account is deleted by you.</p>
        <h5>Private Content</h5>
        <p>With respect to your Private Content, you hereby grant to the Company (and its successors, assigns, and third-party service providers) a worldwide, non-exclusive, revocable, royalty-free, sublicensable, and transferable license to use, publish, publicly perform or display, distribute, transmit, host, store, reproduce, modify, and create derivative works from the Private Content but limited only to the purpose of providing the Service to you and those Users with whom you have shared your Private Content. Further, even if you have removed your Private Content from your account, you agree and acknowledge that it may be retained, backed-up or archived by the Company, at its sole and unfettered discretion, in which case such archived Private Content will remain subject to the forgoing licence either a) until your account is deleted by you; b) indefinitely if you are not a habitual resident of a Member State of the European Economic Area; or c) upon the expiry of a three year period following the removal of your Private Content if you are a habitual resident of a Member State of the European Economic Area.</p>
        <h5>Minor Users</h5>
        <p>Users must be at least 13 years of age or older to use the Service.  Users between 13 and 18 (“Minor Users”) need permission from a parent or guardian to utilize the Service and may only do so through an account established by their parent or legal guardian, with such parent or guardian’s approval. If you permit your child or a minor between 13 and 18 years of age for whom you are legally responsible (your “Child”) to use the Service, you hereby agree to these Terms of Use on behalf of both yourself and your Child. You further agree that you are responsible for any and all use of the Service by your Child regardless of whether such use was authorized by you.</p>
        <p>By using the Service you represent that you are 13 or older, and that you will not permit or facilitate anyone under the age of 13 to use the Service or your account on the Service. Company will not knowingly solicit or accept personally identifiable information or other content from a User under 13 years of age. If Company discovers that a User under 13 years of age has created an account, or has posted personally identifiable information or other content to the Service, Company will terminate that account and remove the information or other content.</p>
        <h5>Termination and Suspension</h5>
        <p>The Company may terminate or suspend any User’s ability to use the Service at any time for any or no reason in its sole and unfettered discretion, with or without notice.  If notice is provided to you, it may be via mail or email, and termination will be effective immediately upon transmission of such notice. Failure to receive such notice, if elected by the Company to be provided, will not limit or alter the Company’s discretion and ability to terminate or suspect any User in accordance with this Section.</p>
        <p>Without limitation to the broad and unrestricted discretion reserved by the Company to suspend or terminate any User at any time, for any or no reason, instances where Company may terminate or suspend a User may include:</p>
        <ol>
          <li><p>a breach of any term of this Agreement or any policy of Company posted through the Service from time to time; or</p></li>
          <li><p>if a User is found to have engaged in inappropriate and/or offensive behavior on the Service.</p></li>
        </ol>
        <p>If the Company terminates or suspends a User for either of these specific reasons, such User will not be entitled to any refund of any account fees paid to the Company, whether the paid period of use has fully elapsed or not.</p>
        <p>If Company terminates or suspends a User for any reason, such user is immediately prohibited from further use of or access to the Service whatsoever, including registering and creating a new account under the same name, a false or borrowed name, or the name of any third party, even if acting on behalf of the third party</p>
        <p>The Company reserves the right to take positive steps, whether technical, legal or otherwise, to prevent and/or terminate your present and future ability to access the Service.</p>
        <p>This Agreement will remain enforceable in its entirety even after a User has been suspended or terminated.  The suspension or termination of your account is without prejudice and will not in any way preclude or limit any other rights of the Corporation or remedies available to it under this Agreement or by operation of law including without limitation pursuing civil, criminal, and injunctive relief.  If Company takes any legal action against you as a result of your breach of this Agreement, Company will be entitled to recover from you, and you agree to pay, all reasonable attorney’s fees and costs of such action, in addition to any other relief granted to Company, on a solicitor and his own client, full indemnity basis.</p>
        <p>You may terminate this Agreement at any time by ceasing all use of the Service, however all sections which by their nature should survive the expiration or termination of this Agreement shall continue in full force and effect subsequent to and notwithstanding the expiration or termination of this Agreement.</p>
        <h5>Liquidated Damages</h5>
        <p>In the event that you have breached these Terms of Service, you agree and acknowledge that you may have caused damage the value of the Service, the Company’s brand and the provision of the Service to other Users.  As such you expressly agree and acknowledge that the following liquidated sums are reasonable estimates of such damages and are not to be construed as penalties for the subject conduct:</p>
        <ol>
          <li><p>If you publish or otherwise publish User Generated Content on or through the Service in violation of these Terms of Service, you agree to immediately pay the Company one thousand Dollars ($1,000) for each and every violating submission or piece of content.</p></li>
          <li><p>If you display, copy, reproduce, sell, or otherwise exploit for any purpose content obtained from or through the Service in violation of these Terms of Service, you agree to pay one thousand dollars ($1,000) for each and every piece of violating content.</p></li>
          <li><p>If you use computer programs or other manual or automatic mechanism to collect data, aggregate records or reports from the Service, or otherwise damage, interfere with, disrupt, impair, or disable the Service, you agree to pay the greater of ten thousand dollars ($10,000) or one thousand dollars ($1,000) for each report or record that is collected, aggregated, disrupted, damaged or otherwise affected by such program or mechanism.</p></li>
        </ol>
        <p>In the event you refuse or fail to provide prompt payment for the above sums, and the Company is forced to take enforcement and/or collection efforts against you, you agree that any such liquidated damages will be in addition to the legal costs incurred by the Company during such efforts, and will be paid by you on a solicitor and his own client basis.</p>
        <p>Unless specifically limited in the above subsections, you agree to pay the actual damages suffered by the Company as a result of any breach of these Terms of Service, including, but not limited to legal costs on a solicitor and his own client basis.</p>
        <p>In addition to any other provision of these Terms of Service, the Company reserves the right to seek a Court order for specific performance of any term contained herein, or injunctive relief against the continuing breach of any of these Terms of Service or in support of the rights contained herein.</p>
        <h5>Account, Password, Security</h5>
        <p>You may be required to register with Company to create an account and use the Service beyond a passive review of what content is made publically accessible without an account. Upon such registration, you are the sole authorized user of your account. You are responsible for maintaining the confidentiality of any password and account specific details provided by you or the Company for accessing the Service. You are solely and fully responsible for all activities that occur under or through your account. Company has no control over the use of any User's account and expressly disclaims any liability associated to such account usage. Should you suspect that any unauthorized party may be using your password or account or you suspect any other breach of security, you must contact the Company immediately. A failure to report such unauthorized use to the Company as soon as is reasonably possible will be interpreted as your consent to such use and you may be responsible for activities carried out under and through your account.</p>
        <p>As a condition of your use of the Service, you agree that all information provided to the Company for your account, including contact information and business details (if applicable) will be true, accurate, and complete and that such information will be updated as necessary to ensure the on-going accuracy and completeness of such information.</p>
        <p>You agree not to create multiple accounts, whether they are under your own name, an alias, pseudonym, operating name or other adopted identity.</p>
        <h5>Email and Phone Use</h5>
        <p>By providing your landline phone number, mobile phone number, email address and using the Service, you consent to the Company’s use of your provided phone number(s) and/or email address for electronic communication including calls, emails and text message in order to operate the Service, to communicate with you in respect to the Service or your account, and to request your feedback as a User. Company will not assess any charges for calls or texts, but standard message and data charges or other charges from your wireless carrier may apply. You may withdraw this consent at any time through the account settings available on the Service or by contacting the Company by email at <a href="mailto:hello@vaniila.com">hello@vaniila.com</a>.</p>
        <h5>Your Information and Content</h5>
        <p>“Personal Information” is defined as any information and materials you provide to the Company or to other Users in connection with your registration for and use of the Service, including without limitation that posted or transmitted for use anywhere on the Service and included Communication Media. You are solely responsible for your Personal Information, and we act merely as a passive conduit for your online distribution and publication of your Personal Information. The information and materials described in this Section, as provided by each User, is collectively referred to herein as “User Generated Content.” You hereby represent and warrant to the Company that your Personal Information and User Generated Content:</p>
        <h5>Links to Other Websites</h5>
        <p>Links (such as hyperlinks) from the Service or from User Generated Content published on or through the Service to other sites on the Web do not constitute the endorsement by the Company of those sites or their content. Such links are provided as an information service, for reference and convenience only. Company does not control any such sites, and is not responsible for their content. The existence of links on the Service to such websites (including without limitation external websites that are framed by the Company Service as well as any advertisements displayed in connection therewith) does not mean that the Company endorses any of the material on such websites, or has any association with their operators. It is your responsibility to evaluate the content and usefulness of the information obtained from other sites.</p>
        <p>The use of any website controlled, owned or operated by third parties is governed by the terms and conditions of use and privacy policies for those websites, and not by the Company's Terms of Service or Privacy Policy. You access such third-party websites at your own risk. The Company expressly disclaims any liability arising in connection with your use and/or viewing of any websites or other material associated with links that may appear on the Service. You hereby agree to hold Company harmless from any liability that may result from the use of links that may appear on the Service.</p>
        <h5>Intellectual Property Rights</h5>
        <p>All text, graphics, editorial content, data, formatting, graphs, designs, computer code, look and feel, photographs, music, sounds, images, software, videos, designs, typefaces and other content (collectively “Proprietary Material”) that Users see or read through the Service is owned, licenced or controlled by or to the Company, excluding User Generated Content. Proprietary Material is protected in all forms, media and technologies now known or hereinafter developed. The Proprietary Material is protected by the domestic and international laws of copyright, patents, and other proprietary rights and laws. Users may not copy, download, use, reproduce, republish, redesign, reconfigure, display, translate, upload, encode, transmit or retransmit anything from the Service for any purpose whatsoever without the Company's express prior written consent and, if applicable, the holder of the rights to the User Generated Content or otherwise licenced content. Any use of such Proprietary Material, other than as permitted therein, is expressly prohibited without the prior permission of the Company and, if applicable, the holder of the rights to the User Generated Content.</p>
        <p>The service marks and trade-marks of Company, including without limitation the Company name and the Company logos are service marks owned by the Company. Any other trade-marks, service-marks, logos and/or trade names appearing via the Service are the property of their respective owners. You may not copy, display, redesign, modify or use any of these marks, logos or trade names without the express prior written consent of the owner.</p>
        <h5>Third-Party Content Tools</h5>
        <p>The Service includes features to search for in an import various third-party content, such as images and videos, into your presentations (“Third-Party Content”).  Although these tools are made available to you, you are responsible to investigate the applicable intellectual property rights and any licences associated to a particular piece of Third-Party Content.  Despite their public accessibility and/or their availability via the Service, Third-Party Content may be wholly restricted from use, limited to certain permitted uses or free for public use.  You agree and acknowledge that you will to inform yourself as to the acceptable use of any Third-Party Content and comply with the terns of ay applicable licences.</p>
        <h5>Copyright Complaints</h5>
        <p>Company respects the intellectual property of others, and expects Users to do the same. If you believe, in good faith, that any materials published on or in connection with the Service infringe upon your copyright or other intellectual property rights, please contact the Company with a description of the copyrighted work that you claim has been infringed, including the URL (Internet address) or other specific location on the Service where the material you claim is infringed is located. Include enough information to allow the Company to locate the material, and explain why you think an infringement has taken place including a reference to your creation or use of such material, and your contact information.</p>
        <h5>Confidential Information</h5>
        <p>You acknowledge that Confidential Information (as hereinafter defined) is a valuable, special and unique asset of the Company and agree that you will not disclose, transfer, use (or seek to induce others to disclose, transfer or use) any Confidential Information for any purpose other than disclosure to your authorized employees and agents who are bound to maintain the confidentiality of Confidential Information. You shall promptly notify Company in writing of any circumstances which may constitute unauthorized disclosure, transfer, or use of Confidential Information. You shall use best efforts to protect Confidential Information from unauthorized disclosure, transfer or use. You shall return all originals and any copies of any and all materials containing Confidential Information to Company upon termination of this Agreement for any reason whatsoever. The term “Confidential Information” shall mean any and all of Company’s trade secrets, confidential and proprietary information and all other information and data of Company that is not generally known to the public or other third parties who could derive value, economic or otherwise, from its use or disclosure. Confidential Information shall be deemed to include technical data, know-how, research, product plans, products, services, customers, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances or other business information disclosed directly or indirectly in writing, orally or by drawings or observation.</p>
        <h5>Disclaimer of Warranties</h5>
        <p><strong>USE OF THE SERVICE IS ENTIRELY AT YOUR OWN RISK.</strong></p>
        <p>THE SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. THE COMPANY MAKES NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE CONTENT PROVIDED THROUGH OR SHARED ON THE SERVICE OR THE CONTENT OF ANY SITES LINKED TO THE SERVICE AND ASSUMES NO LIABILITY OR RESPONSIBILITY FOR ANY (I) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT, (II) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICE OR THOSE OFFERED BY OTHER USERS OF THE SERVICE, (III) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN. COMPANY DOES NOT WARRANT, ENDORSE, GUARANTEE OR ASSUME RESPONSIBILITY FOR ANY SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICE OR ANY HYPERLINKED WEBSITE OR FEATURED IN ANY BANNER OR OTHER ADVERTISING AND COMPANY WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES, OTHER THAN AS PROVIDED HEREIN.</p>
        <p>WITHOUT LIMITING THE FOREGOING, NEITHER THE COMPANY NOR ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS OR AFFILIATES WARRANT THAT ACCESS TO THE SERVICE WILL BE UNINTERRUPTED OR THAT THE SERVICE WILL BE ERROR-FREE; THAT THE SERVICE WILL BE SUITABLE TO YOUR NEEDSS; THAT USER CREATED OR UPLOADED CONTENT WILL STORED OR CONSISTENTLY AND CONTINUOUSLY ACCESSIBLE; THAT ERRORS OR DEFECTS IN THE SERVICE WILL BE CORECTED; NOR DO THEY MAKE ANY WARRANTY AS TO THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE, OR AS TO THE TIMELINESS, ACCURACY, RELIABILITY, COMPLETENESS OR CONTENT OF ANY PRODUCT OR SERVICE, INFORMATION OR MATERIALS PROVIDED THROUGH OR IN CONNECTION WITH THE USE OF THE SERVICE.</p>
        <p>NEITHER THE COMPANY NOR ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS OR AFFILIATES IS RESPONSIBLE FOR THE CONDUCT, WHETHER ONLINE OR OFFLINE, OF ANY USER.</p>
        <p>NEITHER THE COMPANY NOR ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS OR AFFILIATES WARRANT THAT THE SERVICE IS FREE FROM VIRUSES, WORMS, TROJAN HORSES, OR OTHER HARMFUL COMPONENTS.  ANY CONTENT, IMAGES, MATERIAL, INFORMATION, OR DATA DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SERVICE IS ACCESSED AT YOUR OWN DISCRETION AND RISK.  YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM AND/OR LOSS OF DATA THAT RESULT FROM THE DOWNLOAD OF SUCH MATERIAL.</p>
        <p>NO SUPPORT CONTENT, SUPPORT COMMUNICATIONS, ADVICE, REPRESENTATION OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM COMPANY, ITS EMPLOYEES, DIRECTORS, OFFICERS OR AFFILIATES, OR THROUGH THE SERVICE ITSELF SHALL CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THIS AGREEMENT.</p>
        <p>THE COMPANY NOR ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS OR AFFILIATES CANNOT AND DO NOT GUARANTEE THAT ANY PERSONAL INFORMATION SUPPLIED BY YOU WILL NOT BE MISAPPROPRIATED, INTERCEPTED, DELETED, DESTROYED OR USED BY OTHERS.</p>
        <p>YOU SPECIFICALLY ACKNOWLEDGE THAT COMPANY NOR ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS OR AFFILIATES SHALL NOT BE LIABLE FOR USER GENERATE, UPLOADED OR POSTED CONTENT INCLUING BUT NOT LIMITED TO THE DEFAMATORY, OFFENSIVE, OR OTHERWSE ILLEGAL CONDUCT OF ANY THIRD PARTY AND THAT THE RISK OF HARM OR DAMAGE FROM THE FOREGOING RESTS ENTIRELY WITH YOU.</p>
        <h5>Limitation of Liability</h5>
        <p>YOU ACKNOWLEDGE AND AGREE THAT THE COMPANY IS ONLY WILLING TO PROVIDE THE SERVICE IF YOU AGREE TO CERTAIN LIMITATIONS OF OUR LIABLITY TO YOU AND THIRD PARTIES. THEREFORE, YOU AGREE NOT TO HOLD COMPANY, ITS AFFILIATES, ITS LICENSORS, ITS PARTNERS IN PROMOTIONS, SWEEPSTAKES OR CONTESTS, OR ANY OF SUCH PARTIES’ AGENTS, EMPLOYEES, OFFICERS, DIRECTORS, CORPORATE PARTNERS, OR PARTICIPANTS LIABLE FOR ANY DAMAGE, SUITS, CLAIMS, AND/OR CONTROVERSIES (COLLECTIVELY, “LIABILITIES”) THAT HAVE ARISEN OR MAY ARISE, WHETHER KNOWN OR UNKNOWN, RELATING TO YOUR OR ANY OTHER PARTY’S USE OF OR INABILITY TO USE THE SERVICE, EVEN IF GIVEN RISE TO BY THE WILLFUL, NEGLIGENT OR GROSSLY NEGLIGENT CONDUCT OF ANY ABOVE LISTED PERSON, INCLUDING WITHOUT LIMITATION:</p>
        <ol>
          <li><p>ANY LIABILITIES ARISING IN CONNECTION WITH THE CONDUCT, ACT OR OMISSION OF ANY USER (INCLUDING WITHOUT LIMITATION STALKING, HARASSMENT THAT IS SEXUAL OR OTHERWISE, ACTS OF PHYSICAL VIOLENCE, AND DESTRUCTION OF PERSONAL PROPERTY);</p></li>
          <li><p>ANY DISPUTE WITH ANY USER;</p></li>
          <li><p>STATEMENTS MADE BY USERS OR THIRD PARTIES ON OR THROUGH THE SERVICE;</p></li>
          <li><p>ANY INSTRUCTION, ADVICE, ACT, DEALINGS, GOODS OR SERVICES PROVIDED BY ANY OTHER USER ON, THROUGH OR AS A RESULT OF YOUR USE OF THE SERVICE;</p></li>
          <li><p>ANY INTERCEPTION, MODIFICATION, TRANSMISSION OR DESTRUCTION OF YOUR INFORMATION;</p></li>
          <li><p>CONTENT YOU SUBMIT OR PUBLISH TO THE SERVICE;</p></li>
          <li><p>TEMPORARY OR PERMANENT FAILURE OR REFUSAL BY THE COMPANY TO PROVIDE THE SERVICE;</p></li>
          <li><p>CHANGES MADE TO THE SERVICE;</p></li>
          <li><p>LOSS, CORUPTION, DELETION OR FAILURE TO STORE ANY CONTENT OR OTHER PROPERTY CREATED ON OR UPLOADED TO THE SERVICE;</p></li>
          <li><p>ANY BREACH BY THE COMPANY OF THESE TERMS OF SERVICE; UNDER NO CIRCUMSTANCES WILL COMPANY, ITS AFFILIATES, OR ANY OF SUCH PARTIES’ AGENTS, EMPLOYEES, OFFICERS, DIRECTORS, CORPORATE PARTNERS, OR PARTICIPANTS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL OR EXEMPLARY DAMAGES ARISING IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF THE SAME.</p></li>
        </ol>
        <p>THE COMPANY DOES NOT ACCEPT ANY LIABILITY WITH RESPECT TO THE QUALITY OR FITNESS OF ANY WORK PERFORMED OR GOODS OR SERIVCES PROMOTED ON OR THROUGH THE SERVICE.</p>
        <p>THE COMPANY WILL NOT BE RESPONSIBLE FOR ANY DELAY, LIMITATION OR FAILURE IN THE PROVISION OR OPERATION OF THE SERVICE, NOR ANY RESULTANT DAMAGES OR LOSSES, CAUSED BY THE IMPERFECT OPERATION OF THE INTERNET, YOUR INTERNET SERVICE PROVIDER, ANY INTERMEDIARY COMMUNICATION CHANNEL, ANY BLOCKAGE OR DISRUPTION IN COMMUNICATIONS BETWEEN YOU AND OUR SERVICE, OR DISRUPTIONS BY OR AT OUR HOSTING PROVIDER.</p>
        <p>IF, NOTWITHSTANDING THE FOREGOING EXCLUSIONS, IT IS DETERMINED THAT THE COMPANY OR ITS PARTNERS IN PROMOTIONS, SWEEPSTAKES OR CONTESTS, AFFILIATES, ITS LICENSORS, OR ANY OF SUCH PARTIES’ AGENTS, EMPLOYEES, OFFICERS, DIRECTORS, CORPORATE PARTNERS, OR PARTICIPANTS IS LIABLE FOR DAMAGES, IN NO EVENT WILL THE AGGREGATE LIABILITY, WHETHER ARISING IN CONTRACT, TORT, STRICT LIABILITY OR OTHERWISE, EXCEED THE GREATER OF:</p>
        <ol>
          <li><p>THE TOTAL SERVICE FEES PAID BY YOU TO THE COMPANY DURING THE SIX (6) MONTHS PRIOR TO THE TIME SUCH CLAIM AROSE; OR</p></li>
          <li><p>ONE HUNDRED ($100) DOLLARS.</p></li>
        </ol>
        <p>THESE LIMITATIONS SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW.  IN THE EVENT THE EXCLUSIONS AND/OR LIMITATIONS CONTAINED IN THESE TERMS OF SERVICE ARE NOT ENFORCEABLE IN YOUR JURISDICTION, THEN THE LIABILITY OF THE COMPANY WILL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,</p>
        <h5>Indemnification</h5>
        <p>You hereby agree to indemnify, defend, and hold harmless the Company, its directors, officers, employees, agents, licensors, attorneys, independent contractors, providers, subsidiaries, and affiliates from and against any and all claim, loss, expense or demand of liability, including legal fees and costs incurred on a solicitor-client full indemnity basis, in connection with</p>
        <ol>
          <li><p>your use of, or inability to use the Service;</p></li>
          <li><p>your provision of goods and/or services promoted through or on the Service;</p></li>
          <li><p>any third party claim made which in any way relates to your use of the Service; or</p></li>
          <li><p>any content submitted by you or using your account to the Service, including, but not limited to the extent such content may infringe on the intellectual rights of a third party or otherwise be illegal or unlawful.</p></li>
        </ol>
        <p>The Company reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to your indemnification. You will not, in any event, settle any claim or matter which is in any way related to the Company or use of the Service without the written consent of the Company.</p>
        <h5>User Feedback and Suggestions</h5>
        <p>The Company values its Users and welcomes contact and comments by them through means identified on the Company website and/or apps.  In the event you choose, of your own accord and acknowledging the Company has not requested the same from you, to submit creative ideas, suggestions or materials to us, you expressly agree that such submission (a “Submitted Concept”) will immediately become the property of the Company.   As such, the Company may act on, incorporate, develop, expand, modify, transfer, licence and/or sell any Submitted Concept in its sole and unfettered discretion, without obligation of credit, payment, royalties or compensation of any kind being due to the submitting User.  The Company will not be liable for any future use, disclosure, sale or in any other way at all in respect to a Submitted Concept.</p>
        <h5>Dispute Resolution</h5>
        <p>Except to the extent that the Company seeks injunctive or other equitable relief to enforce provisions of this Agreement, if you and the Company are unable to resolve any dispute which has arisen in any way related to the use of the Service by your or any third-party through informal negotiations all claims arising from use of the Service (except those expressly excluded below) finally and exclusively resolved by binding arbitration. Such arbitration shall be conducted before a single arbitrator chosen by agreement of the parties, and failing agreement, in accordance with the provisions of the Arbitration Act (Alberta). The decision of the arbitrator shall be final and binding and no appeal shall lie therefrom. The arbitration proceeding shall be conducted in Edmonton, Alberta, unless the parties otherwise agree. Judgment upon the award rendered by the arbitration may be entered in any court having competent jurisdiction thereof. Each party shall bear its own costs of the arbitration and shall share equally the costs of the arbitrator.</p>
        <p>You and the Company agree that any arbitration will be limited to the dispute between the Company and you individually. YOU ACKNOWLEDGE AND AGREE THAT YOU AND THE COMPANY ARE EACH WAIVING THE RIGHT TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION OR REPRESENTATIVE PROCEEDING. Further, unless both you and the Company otherwise agree, the arbitrator may not consolidate more than one person’s claims, and may not otherwise preside over any form of any class or representative proceeding. If this specific paragraph is held unenforceable, then the entirety of this “Dispute Resolution” Section will be deemed null and void.</p>
        <h5>Notices</h5>
        <p>You consent to the receipt of any notices or communications required under these Terms or Service, or by any statute or regulation by way of electronic communication to the email address provided by you on your account created for use of the Service (“Account Email”).  Any error or change in your Account Email, lack of access to your Account Email or other disruption in your receipt of any notice properly sent to your Account Email will not invalid the provision of such notice and such notice will be deemed to have been received as of the date of transmission.  You further agree that the Company may, in its sole discretion, communicate with you by telephone or mail or posting notices to the Service.</p>
        <p>All notices provided to the Company must be sent by email to <a href="mailto:hello@vaniila.com">hello@vaniila.com</a>.</p>
        <p>Notices sent to the Company will be deemed delivered two (2) business days after receipt of the email transmission to the above address.</p>
        <h5>Governing Law</h5>
        <p>This Agreement shall be construed and enforced in accordance with, and the rights of the parties hereto shall be governed by, the laws of the Province of Alberta. Each of the Parties hereto hereby irrevocably attorns to the jurisdiction of the courts in the Province of Alberta, unless in its sole and unfettered discretion the Company elects to litigate an action in the country, province or state where any breach of these Terms of Service was committed or where you can otherwise be found.</p>
        <h5>No Agency</h5>
        <p>No agency, partnership, joint venture, employer-employee or franchiser-franchisee relationship is intended or created by this Agreement.</p>
        <h5>Time</h5>
        <p>Time shall be of the essence of this Agreement.</p>
        <h5>Entire Agreement</h5>
        <p>This Agreement supersedes all other agreements between the parties hereto and constitutes the entire agreement between the parties and there are no statements, representations, warranties, undertakings or agreements, written or oral, express or implied, between the parties hereto except as herein set forth.  Additional agreements, terms, contracts or legal relationships may exist between you and other Users of the Service, including the Listed Businesses (“Third Party Agreements”) which do not include the Company as a party. You warrant that such Third Party Agreements do not interfere with your obligations under these Terms of Service.</p>
        <h5>Non-waiver</h5>
        <p>Failure by the Company to enforce any provision(s) of this Agreement will not be construed as a waiver of any provision or right.</p>
        <h5>Severability</h5>
        <p>If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions will be enforced to the fullest extent possible, and the remaining provisions will remain in full force and effect.</p>
        <h5>Enurement</h5>
        <p>This Agreement will enure to the benefit of Company, its successors and assigns.</p>
        <h5>Changes to this Agreement and the Service</h5>
        <p>The Company reserves the right, at its sole and unfettered discretion, to change, modify, add to, supplement or delete any of the terms and conditions of this Agreement (including the Privacy Policy) and review, improve, modify or discontinue, temporarily or permanently, the Service or any content or information through the Service at any time, effective with or without prior notice and without any liability to the Company. Company will endeavor to notify you of these changes by email or through notification on the Service, but will not be liable for any failure to do so and you agree that it is your responsibility to review this Agreement from time to time in order to inform yourself of changes or revisions to it. If any future changes to this Agreement are unacceptable to you or cause you to no longer be in compliance with this Agreement, you must terminate, and immediately stop using, the Service. Your continued use of the Service following any revision to this Agreement constitutes your complete and irrevocable acceptance of any and all such changes. The Company may change, modify, suspend, or discontinue any aspect of the Service at any time without notice or liability. The Company may also impose limits on certain features or restrict your access to parts or all of the Service without notice or liability.</p>
        <p><strong>I, ON BEHALF OF MYSELF OR ANY CORPORATION, PARTNERSHIP OR OTHER BUSINESS ENTITY FOR WHICH I ACT, HEREBY ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THE FOREGOING TERMS OF SERVICE, AND PRIVACY POLICY AND AGREE THAT MY USE OF THE SERVICE IS AN ACKNOWLEDGMENT OF MY AGREEMENT TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS AGREEMENT.</strong></p>
        <p>EFFECTIVE DATE</p>
        <p>These Terms of Service were last revised on November 22, 2016.</p>
        <p>If you have any questions or comments regarding these Terms of Service, or wish to report a violation of them by them by a User or any third party, please contact us at <a href="mailto:hello@vaniila.com">hello@vaniila.com</a>. </p>
      </div>

      <AppFooter />

    </div>
  }

}

export default withRedux(Tos);


