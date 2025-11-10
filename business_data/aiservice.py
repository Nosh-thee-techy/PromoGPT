"""
AI Campaign Generation Service
This is a placeholder - you can integrate with OpenAI, Claude, or other AI services
"""
import json
from datetime import datetime, timedelta
from .models import Product, SalesRecord


class CampaignGenerator:
    """Generate marketing campaigns based on business data"""

    def __init__(self, business):
        self.business = business

    def analyze_products(self):
        """Analyze product data"""
        products = Product.objects.filter(business=self.business)
        
        analysis = {
            'total_products': products.count(),
            'categories': list(products.values_list('category', flat=True).distinct()),
            'price_range': {
                'min': products.order_by('price').first().price if products.exists() else 0,
                'max': products.order_by('-price').first().price if products.exists() else 0,
            },
            'top_products': list(products.order_by('-price')[:5].values('name', 'price', 'category'))
        }
        
        return analysis

    def analyze_sales(self):
        """Analyze sales data"""
        sales = SalesRecord.objects.filter(business=self.business)
        
        if not sales.exists():
            return {'total_sales': 0, 'total_revenue': 0, 'trends': []}
        
        total_revenue = sum(sale.revenue for sale in sales)
        total_quantity = sum(sale.quantity for sale in sales)
        
        # Get top selling products
        top_products = {}
        for sale in sales:
            product_name = sale.product.name
            if product_name not in top_products:
                top_products[product_name] = {'quantity': 0, 'revenue': 0}
            top_products[product_name]['quantity'] += sale.quantity
            top_products[product_name]['revenue'] += sale.revenue
        
        top_selling = sorted(
            top_products.items(),
            key=lambda x: x[1]['quantity'],
            reverse=True
        )[:5]
        
        return {
            'total_sales': sales.count(),
            'total_revenue': total_revenue,
            'total_quantity': total_quantity,
            'average_order_value': total_revenue / sales.count() if sales.count() > 0 else 0,
            'top_selling': [{'name': name, **data} for name, data in top_selling]
        }

    def generate_campaign(self, goal, budget):
        """Generate a marketing campaign"""
        product_analysis = self.analyze_products()
        sales_analysis = self.analyze_sales()
        
        # Simple template-based generation (replace with AI API call)
        campaign = {
            'goal': goal,
            'budget': budget,
            'business_name': self.business.name,
            'industry': self.business.industry,
            'summary': self._generate_summary(product_analysis, sales_analysis, goal, budget),
            'social_posts': self._generate_social_posts(product_analysis, sales_analysis),
            'ad_copy': self._generate_ad_copy(product_analysis, sales_analysis, budget),
            'campaign_calendar': self._generate_calendar(),
            'insights': self._generate_insights(product_analysis, sales_analysis),
        }
        
        return campaign

    def _generate_summary(self, products, sales, goal, budget):
        """Generate campaign summary"""
        top_product = products['top_products'][0]['name'] if products['top_products'] else 'your products'
        
        return f"""
🎯 Campaign Overview for {self.business.name}

Goal: {goal}
Budget: KSh {budget:,.0f}
Industry: {self.business.industry}

Based on your data analysis:
- You have {products['total_products']} products across {len(products['categories'])} categories
- Your top-selling product is {top_product}
- Total revenue: KSh {sales.get('total_revenue', 0):,.0f}

This campaign is designed to maximize your reach in the Kenyan market with culturally relevant content.
"""

    def _generate_social_posts(self, products, sales):
        """Generate social media posts"""
        business_name = self.business.name
        
        posts = [
            {
                'platform': 'Facebook & Instagram',
                'type': 'Product Showcase',
                'content': f"""🔥 Exclusive Deal Alert! 🔥

{business_name} brings you quality products at unbeatable prices!

✨ Limited time offer - Don't miss out!
📍 Visit us today or order online
💰 Special discounts for our loyal customers

Tag a friend who needs to see this! 👇

#{business_name.replace(' ', '')} #KenyanBusiness #QualityProducts #NairobiShopping""",
                'image_suggestions': 'Product collage with vibrant colors, include price tags'
            },
            {
                'platform': 'WhatsApp Status',
                'type': 'Quick Update',
                'content': f"""💚 {business_name} 💚

Special offer this week only! 

Message us to order:
☎️ [Your Number]

Quick delivery across Nairobi!""",
                'image_suggestions': 'Simple product image with price'
            },
            {
                'platform': 'Twitter/X',
                'type': 'Engagement',
                'content': f"""🎉 GIVEAWAY ALERT! 🎉

Win amazing products from {business_name}! 

To enter:
✅ Follow us
✅ RT this tweet
✅ Tag 3 friends

Winner announced Friday! 🇰🇪

#KenyanTwitter #Giveaway #{business_name.replace(' ', '')}""",
                'image_suggestions': 'Eye-catching giveaway graphic'
            },
            {
                'platform': 'Instagram Stories',
                'type': 'Behind the Scenes',
                'content': f"""📸 Behind the scenes at {business_name}!

Swipe up to see how we ensure quality for our customers

[Interactive poll]: What product do you want to see next?

🛒 Shop via link in bio!""",
                'image_suggestions': 'Authentic behind-the-scenes photos/videos'
            },
            {
                'platform': 'Facebook',
                'type': 'Customer Testimonial',
                'content': f"""⭐⭐⭐⭐⭐ 5-Star Review!

"I've been buying from {business_name} for months now. Quality products, great prices, and fast delivery. Highly recommend!" - Happy Customer

Join hundreds of satisfied customers across Kenya!

🛍️ Order now: [Your Contact]

#{business_name.replace(' ', '')} #CustomerFirst #TrustedBrand""",
                'image_suggestions': 'Customer testimonial graphic with stars'
            }
        ]
        
        return posts

    def _generate_ad_copy(self, products, sales, budget):
        """Generate advertising copy"""
        business_name = self.business.name
        
        ads = [
            {
                'platform': 'Facebook Ads',
                'type': 'Carousel Ad',
                'headline': f'Shop Quality at {business_name}',
                'primary_text': f"""Discover amazing deals on quality products! 

🎁 Special offers for new customers
🚚 Fast delivery across Kenya
💯 100% genuine products

Click to browse our collection!""",
                'call_to_action': 'Shop Now',
                'targeting': 'Age 25-45, Nairobi & major cities, Interest: Shopping, Online shopping',
                'budget_suggestion': f'KSh {budget * 0.4:,.0f} (40% of budget)',
            },
            {
                'platform': 'Instagram Ads',
                'type': 'Story Ad',
                'headline': f'{business_name} - Your Trusted Store',
                'primary_text': f"""Limited time offer! 🔥

Tap to see our latest collection

Free delivery on orders over KSh 1,000!""",
                'call_to_action': 'Learn More',
                'targeting': 'Age 18-35, Urban Kenya, Interest: Fashion, Lifestyle, Shopping',
                'budget_suggestion': f'KSh {budget * 0.3:,.0f} (30% of budget)',
            },
            {
                'platform': 'Google Ads',
                'type': 'Search Ad',
                'headline': f'Buy Quality Products - {business_name}',
                'description': f'Trusted by thousands of Kenyans. Great prices, fast delivery. Order online today!',
                'keywords': f'{self.business.industry} Kenya, buy online Nairobi, quality products Kenya',
                'budget_suggestion': f'KSh {budget * 0.3:,.0f} (30% of budget)',
            }
        ]
        
        return ads

    def _generate_calendar(self):
        """Generate a content calendar"""
        today = datetime.now()
        calendar = []
        
        # Generate 2-week schedule
        for i in range(14):
            date = today + timedelta(days=i)
            day_name = date.strftime('%A')
            
            if day_name in ['Monday', 'Wednesday', 'Friday']:
                content_type = 'Product Post'
            elif day_name in ['Tuesday', 'Thursday']:
                content_type = 'Engagement Post'
            elif day_name == 'Saturday':
                content_type = 'Weekend Special'
            else:  # Sunday
                content_type = 'Customer Testimonial'
            
            calendar.append({
                'date': date.strftime('%Y-%m-%d'),
                'day': day_name,
                'content_type': content_type,
                'platform': 'Facebook, Instagram, Twitter',
                'time': '10:00 AM, 4:00 PM' if day_name != 'Sunday' else '2:00 PM'
            })
        
        return calendar

    def _generate_insights(self, products, sales):
        """Generate business insights"""
        insights = []
        
        if products['total_products'] < 10:
            insights.append({
                'type': 'opportunity',
                'title': 'Expand Your Product Range',
                'message': 'Consider adding more products to give customers more choices.'
            })
        
        if sales.get('total_revenue', 0) > 100000:
            insights.append({
                'type': 'success',
                'title': 'Strong Sales Performance',
                'message': f"You've generated KSh {sales['total_revenue']:,.0f} in revenue. Keep up the momentum!"
            })
        
        if sales.get('top_selling'):
            top_product = sales['top_selling'][0]['name']
            insights.append({
                'type': 'recommendation',
                'title': 'Focus on Best Sellers',
                'message': f'"{top_product}" is your top seller. Consider creating more content around this product.'
            })
        
        insights.append({
            'type': 'tip',
            'title': 'Leverage WhatsApp',
            'message': 'WhatsApp is huge in Kenya. Share your campaigns via WhatsApp Status and groups.'
        })
        
        insights.append({
            'type': 'tip',
            'title': 'Mobile-First Strategy',
            'message': 'Most Kenyans access social media via mobile. Ensure all your content is mobile-optimized.'
        })
        
        return insights