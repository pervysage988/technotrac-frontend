import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <Shield className="mx-auto h-12 w-12 mb-4 text-primary" />
                    <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
                    <CardDescription>
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="english" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="english">English</TabsTrigger>
                            <TabsTrigger value="hindi">हिन्दी (Hindi)</TabsTrigger>
                        </TabsList>

                        {/* English */}
                        <TabsContent value="english" className="mt-6 prose max-w-none">
                            <h2 className="font-headline">Introduction</h2>
                            <p>
                                Welcome to TechnoTrac. We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, process, and disclose your information in conjunction with your access to and use of the TechnoTrac platform.
                            </p>

                            <h2 className="font-headline">1. Information We Collect</h2>
                            <p>
                                [Placeholder] Detail the types of personal data you collect (e.g., name, phone number, location, KYC documents, device information).
                            </p>

                            <h2 className="font-headline">2. How We Use Your Information</h2>
                            <p>
                                [Placeholder] Explain the purposes for which you use the collected data (e.g., to provide and improve the service, for user verification, to facilitate bookings, for security and fraud prevention). This must align with the &quot;lawful purpose&quot; principle under the DPDP Act.
                            </p>

                            <h2 className="font-headline">3. Consent</h2>
                            <p>
                                [Placeholder] Describe how you obtain clear and informed consent from users before collecting their personal data. Explain that users can withdraw their consent.
                            </p>

                            <h2 className="font-headline">4. Data Retention</h2>
                            <p>
                                [Placeholder] State your policy on data retention, explaining that data is only kept for as long as necessary to fulfill the purpose for which it was collected.
                            </p>

                            <h2 className="font-headline">5. Your Rights</h2>
                            <p>
                                [Placeholder] Inform users of their rights under the DPDP Act, such as the right to access, correct, and erase their data.
                            </p>

                            <p className="mt-8 text-sm text-muted-foreground">
                                This is a template and not legal advice. Please consult with a legal professional to create a comprehensive and compliant Privacy Policy.
                            </p>
                        </TabsContent>

                        {/* Hindi */}
                        <TabsContent value="hindi" className="mt-6 prose max-w-none">
                            <h2 className="font-headline">परिचय</h2>
                            <p>
                                टेक्नोट्रैक में आपका स्वागत है। हम आपकी गोपनीयता की रक्षा करने और यह सुनिश्चित करने के लिए प्रतिबद्ध हैं कि आपका व्यक्तिगत डेटा सुरक्षित और जिम्मेदारी से संभाला जाए। यह गोपनीयता नीति बताती है कि हम टेक्नोट्रैक प्लेटफॉर्म तक आपकी पहुंच और उपयोग के साथ आपकी जानकारी कैसे एकत्र, उपयोग, संसाधित और प्रकट करते हैं।
                            </p>

                            <h2 className="font-headline">1. हम जो जानकारी एकत्र करते हैं</h2>
                            <p>
                                [प्लेसहोल्डर] आपके द्वारा एकत्र किए जाने वाले व्यक्तिगत डेटा के प्रकारों का विवरण दें (जैसे, नाम, फोन नंबर, स्थान, केवाईसी दस्तावेज़, डिवाइस जानकारी)।
                            </p>

                            <h2 className="font-headline">2. हम आपकी जानकारी का उपयोग कैसे करते हैं</h2>
                            <p>
                                [प्लेसहोल्डर] उन उद्देश्यों की व्याख्या करें जिनके लिए आप एकत्रित डेटा का उपयोग करते हैं (उदाहरण के लिए, सेवा प्रदान करने और सुधारने के लिए, उपयोगकर्ता सत्यापन के लिए, बुकिंग की सुविधा के लिए, सुरक्षा और धोखाधड़ी की रोकथाम के लिए)। यह डीपीडीपी अधिनियम के तहत &quot;वैध उद्देश्य&quot; सिद्धांत के अनुरूप होना चाहिए।
                            </p>

                            <h2 className="font-headline">3. सहमति</h2>
                            <p>
                                [प्लेसहोल्डर] वर्णन करें कि आप उपयोगकर्ताओं से उनका व्यक्तिगत डेटा एकत्र करने से पहले स्पष्ट और सूचित सहमति कैसे प्राप्त करते हैं। बताएं कि उपयोगकर्ता अपनी सहमति वापस ले सकते हैं।
                            </p>

                            <h2 className="font-headline">4. डेटा प्रतिधारण</h2>
                            <p>
                                [प्लेसहोल्डर] डेटा प्रतिधारण पर अपनी नीति बताएं, यह समझाते हुए कि डेटा केवल तब तक रखा जाता है जब तक कि उस उद्देश्य को पूरा करने के लिए आवश्यक हो जिसके लिए इसे एकत्र किया गया था।
                            </p>

                            <h2 className="font-headline">5. आपके अधिकार</h2>
                            <p>
                                [प्लेसहोल्डर] उपयोगकर्ताओं को डीपीडीपी अधिनियम के तहत उनके अधिकारों के बारे में सूचित करें, जैसे कि उनके डेटा तक पहुंचने, सही करने और मिटाने का अधिकार।
                            </p>

                            <p className="mt-8 text-sm text-muted-foreground">
                                यह एक टेम्पलेट है और कानूनी सलाह नहीं है। व्यापक और अनुपालन वाली गोपनीयता नीति बनाने के लिए कृपया किसी कानूनी पेशेवर से सलाह लें।
                            </p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
