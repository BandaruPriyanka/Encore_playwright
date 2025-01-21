const { executeStep } = require('../../utils/action');
const { assertElementVisible } = require('../../utils/helper');
const utilConst = require('../../utils/const');

exports.InAppNotificationPage = class InAppNotificationPage {
    constructor(page) {
        this.page = page;
        this.bellNotification = page.locator("//icon[@name='bell_notification_line']");
        this.notificationsDropdown = page.locator("//select[@name='notifications']");
        this.closeNotification = page.locator("//icon[@name='cross_line']");
        this.iconInPage = iconText => this.isMobile ? this.page.locator(`//app-flowsheet-detail/div[1]/div[2]//app-mood-icon/icon[@class='` + iconText + `']`)
              : this.page.locator(`//app-flowsheet-detail/div[1]/div[1]//app-mood-icon/icon[@class='` + iconText + `']`);
        this.commentBoxInput = this.page.locator("//span[text()='Comment']//following-sibling::textarea");
    }

    async assertNotificationIcon() {
        await assertElementVisible(this.bellNotification,"Verify that notification is visible");
        await executeStep(this.bellNotification,"click","Click on notification icon");
        await assertElementVisible(this.notificationsDropdown,"Verify notification dropdown is there are not");
        await executeStep(this.closeNotification,"click","Click on close notifcation");
    }

    async clickOnYellowMoodChangeIcon() {
        await assertElementVisible(
          this.iconInPage(utilConst.Const.moodIconText),
          'Verify the mood change icon is visible'
        );
        await executeStep(
          this.iconInPage(utilConst.Const.moodIconText),
          'click',
          'Click on mood chnage icon'
        );
        await assertElementVisible(this.moodModalText, 'Verify the mood change modal is visible');
        await executeStep(
          this.moodChangeIconInModal(utilConst.Const.yellowIconText),
          'click',
          'Click on neutal icon in modal'
        );
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.commentBoxInput, 'fill', 'Enter the comment for neutral mood', [
            indexPage.lighthouse_data.neutralComment
        ]);
        await executeStep(this.submitButton, 'click', 'Click on submit button');
        await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
      }

      async assertUnreadNotificationOption () {
      }
}