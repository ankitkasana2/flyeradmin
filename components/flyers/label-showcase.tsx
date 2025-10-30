"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlyerLabel } from "./flyer-label"
import { FlyerRibbon } from "./flyer-ribbon"
import { FlyerCardWithLabels } from "./flyer-card-with-labels"

export function LabelShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Flyer Labels & Ribbons</h2>
        <p className="text-muted-foreground">Visual identity system for flyer categorization</p>
      </div>

      {/* Label Types */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Available Labels</CardTitle>
          <CardDescription className="text-muted-foreground">
            Different label variants for flyer identification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Photo Flyers</p>
              <FlyerLabel label="PHOTO" variant="photo" />
              <p className="text-xs text-muted-foreground mt-1">For flyers that allow image uploads (DJ/Artist)</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Premium Flyers</p>
              <FlyerLabel label="PREMIUM" variant="premium" />
              <p className="text-xs text-muted-foreground mt-1">For premium tier flyers</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">New Flyers</p>
              <FlyerLabel label="NEW" variant="new" />
              <p className="text-xs text-muted-foreground mt-1">For recently added flyers</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Featured Flyers</p>
              <FlyerLabel label="FEATURED" variant="featured" />
              <p className="text-xs text-muted-foreground mt-1">For featured/promoted flyers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ribbon Combinations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Ribbon Combinations</CardTitle>
          <CardDescription className="text-muted-foreground">
            Flyers can display multiple ribbons simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo Only */}
            <div className="relative w-full h-32 bg-secondary rounded border border-border flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Photo Flyer</div>
              <FlyerRibbon isPhotoFlyer={true} isPremium={false} />
            </div>

            {/* Premium Only */}
            <div className="relative w-full h-32 bg-secondary rounded border border-border flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Premium Flyer</div>
              <FlyerRibbon isPhotoFlyer={false} isPremium={true} />
            </div>

            {/* Both */}
            <div className="relative w-full h-32 bg-secondary rounded border border-border flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Premium + Photo</div>
              <FlyerRibbon isPhotoFlyer={true} isPremium={true} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Cards */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Example Flyer Cards</CardTitle>
          <CardDescription className="text-muted-foreground">How labels appear on actual flyer cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FlyerCardWithLabels
              id={1}
              title="DJ Night Vibes"
              price="$40"
              category="Party"
              formType="With Photo"
              isPremium={true}
              isPhotoFlyer={true}
            />
            <FlyerCardWithLabels
              id={2}
              title="Birthday Bash"
              price="$10"
              category="Birthday"
              formType="Only Info"
              isPremium={false}
              isPhotoFlyer={false}
              isNew={true}
            />
            <FlyerCardWithLabels
              id={3}
              title="Wedding Elegance"
              price="$40"
              category="Wedding"
              formType="With Photo"
              isPremium={true}
              isPhotoFlyer={true}
              isFeatured={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
