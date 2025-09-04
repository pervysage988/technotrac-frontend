import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <FileText className="mx-auto h-12 w-12 mb-4 text-primary" />
                    <CardTitle className="font-headline text-3xl">Terms of Service</CardTitle>
                    <CardDescription>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="english" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="english">English</TabsTrigger>
                            <TabsTrigger value="hindi">हिन्दी (Hindi)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="english" className="mt-6 prose max-w-none">
                            <p>
                                Please read these Terms of Service carefully before using the TechnoTrac service.
                            </p>

                            <h2 className="font-headline">1. Acceptance of Terms</h2>
                            <p>
                                [Placeholder] By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                            </p>

                            <h2 className="font-headline">2. Service Description</h2>
                            <p>
                                [Placeholder] Describe what TechnoTrac is - a peer-to-peer marketplace for agricultural equipment rental. Detail the roles of Owners and Farmers (renters).
                            </p>

                            <h2 className="font-headline">3. User Accounts</h2>
                            <p>
                                [Placeholder] Explain the requirements for creating an account, user responsibilities for account security, and conditions for termination.
                            </p>

                             <h2 className="font-headline">4. Bookings, Payments, and Fees</h2>
                            <p>
                                [Placeholder] Detail the process for booking equipment, payment terms, cancellation policies, and your commission structure (e.g., the 10% commission fee).
                            </p>

                            <h2 className="font-headline">5. Limitation of Liability</h2>
                            <p>
                                [Placeholder] Include a clause limiting your liability regarding equipment condition, user conduct, and other potential issues arising from the use of the platform.
                            </p>
                            
                            <p className="mt-8 text-sm text-muted-foreground">
                                This is a template and not legal advice. Please consult with a legal professional to create a comprehensive and compliant Terms of Service.
                            </p>
                        </TabsContent>
                        <TabsContent value="hindi" className="mt-6 prose max-w-none">
                             <p>
                                टेक्नोट्रैक सेवा का उपयोग करने से पहले कृपया इन सेवा की शर्तों को ध्यान से पढ़ें।
                            </p>

                            <h2 className="font-headline">1. शर्तों की स्वीकृति</h2>
                            <p>
                                [प्लेसहोल्डर] हमारी सेवा तक पहुंच या उसका उपयोग करके, आप इन शर्तों से बंधे होने के लिए सहमत हैं। यदि आप शर्तों के किसी भी हिस्से से असहमत हैं, तो आप सेवा तक नहीं पहुंच सकते।
                            </p>

                            <h2 className="font-headline">2. सेवा विवरण</h2>
                            <p>
                                [प्लेसहोल्डर] वर्णन करें कि टेक्नोट्रैक क्या है - कृषि उपकरण किराए पर लेने के लिए एक पीयर-टू-पीयर मार्केटप्लेस। मालिकों और किसानों (किराएदारों) की भूमिकाओं का विवरण दें।
                            </p>

                            <h2 className="font-headline">3. उपयोगकर्ता खाते</h2>
                            <p>
                                [प्लेसहोल्डर] खाता बनाने की आवश्यकताओं, खाता सुरक्षा के लिए उपयोगकर्ता की जिम्मेदारियों और समाप्ति की शर्तों की व्याख्या करें।
                            </p>

                             <h2 className="font-headline">4. बुकिंग, भुगतान और शुल्क</h2>
                            <p>
                                [प्लेसहोल्डर] उपकरण बुकिंग, भुगतान की शर्तों, रद्दीकरण नीतियों और आपके कमीशन ढांचे (जैसे, 10% कमीशन शुल्क) के लिए प्रक्रिया का विवरण दें।
                            </p>

                            <h2 className="font-headline">5. देयता की सीमा</h2>
                            <p>
                                [प्लेसहोल्डर] उपकरण की स्थिति, उपयोगकर्ता के आचरण और प्लेटफॉर्म के उपयोग से उत्पन्न होने वाले अन्य संभावित मुद्दों के संबंध में आपकी देयता को सीमित करने वाला एक खंड शामिल करें।
                            </p>
                            
                            <p className="mt-8 text-sm text-muted-foreground">
                                यह एक टेम्पलेट है और कानूनी सलाह नहीं है। व्यापक और अनुपालन वाली सेवा की शर्तें बनाने के लिए कृपया किसी कानूनी पेशेवर से सलाह लें।
                            </p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
